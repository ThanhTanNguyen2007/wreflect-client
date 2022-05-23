import React, { useState, useEffect } from 'react';
import { Form, FormInstance, Input, notification, Switch } from 'antd';

import { SmileOutlined } from '@ant-design/icons';
import { Board, Column } from '../../../../types';

type Props = {
  board?: Board;
  column?: Column;
  form: React.RefObject<FormInstance<any>>;
  placeholder: string;

  titleColumn?: string;
};

export default function ConfigColumn({ form, placeholder, column, titleColumn = '' }: Props) {
  const [isActive, setIsActive] = useState<boolean>(column ? column?.isActive : false);

  useEffect(() => {
    form?.current?.setFieldsValue({
      [placeholder]: titleColumn,
      [`isActive${placeholder}`]: column ? column?.isActive : titleColumn ? true : false,
    });
    setIsActive(column ? column?.isActive : titleColumn ? true : false);
  }, [titleColumn]);

  const handleSwitch = (checked: boolean) => {
    if (!form.current?.getFieldValue([placeholder])) {
      notification.warning({
        placement: 'bottomRight',
        message: `Empty value on ${placeholder}`,
      });
      return;
    }
    setIsActive(checked);
    form.current.setFieldsValue({
      [`isActive${placeholder}`]: checked,
    });
  };

  return (
    <>
      <div className="configColumn">
        <Form.Item name={placeholder} initialValue={titleColumn}>
          <Input prefix={<SmileOutlined />} defaultValue={titleColumn} placeholder={placeholder} />
        </Form.Item>
        <Form.Item name={`isActive${placeholder}`} initialValue={isActive}>
          <Switch onChange={handleSwitch} checked={isActive} />
        </Form.Item>
      </div>
    </>
  );
}
