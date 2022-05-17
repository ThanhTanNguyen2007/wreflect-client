import { useMutation } from '@apollo/client';
import { Form, Modal, DatePicker, Input, Checkbox, FormInstance, notification } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { UserMutations } from '../../../grapql-client/mutations';
import { banUserResult, banUserVars } from '../../../grapql-client/mutations/UserMutation';
import { User } from '../../../types';

const { RangePicker } = DatePicker;

type Props = {
  user: User;
  setUser: (user: User) => void;
};

export default function BanUserModal({ user, setUser }: Props) {
  //   const form = useRef<FormInstance>();
  const [form] = Form?.useForm();
  const [isBannedForever, setIsBannedForever] = useState(false);

  function disabledDate(current: moment.Moment) {
    return current && current < moment().startOf('day');
  }

  const [banUser] = useMutation<banUserResult, banUserVars>(UserMutations?.banUser, {
    onError: (error) => {
      notification?.error({
        message: error?.message,
        placement: 'bottomRight',
      });
    },
    onCompleted: () => {
      notification?.success({
        message: 'Banned Success',
        placement: 'bottomRight',
      });
    },
  });

  const onHandleBanned = () => {
    form?.validateFields().then(async (values: any) => {
      const isBannedForever = values['isBannedForever'];
      const title = values['title'];
      const description = values['description'];
      const startDate = values['datePicker'] && values['datePicker'][0];
      const endDate = values['datePicker'] && values['datePicker'][1];

      await banUser({
        variables: {
          userId: user?.id,
          isBannedForever,
          title,
          description,
          startDate,
          endDate,
        },
      });

      setUser(null);
    });
  };

  return (
    <Modal visible={!!user?.id} onOk={() => onHandleBanned()} onCancel={() => setUser(null)}>
      <Form form={form} layout="vertical">
        <Form.Item name="email" label="Email" initialValue={user?.email}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="nickname" label="Nick Name" initialValue={user?.nickname}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title Banning"
          initialValue=""
          rules={[
            {
              required: true,
              message: 'Title Banning not allow to Empty.',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description Banning"
          rules={[
            {
              required: true,
              message: 'Description Banning not allow to Empty.',
            },
          ]}
          initialValue=""
        >
          <Input />
        </Form.Item>
        <Form.Item initialValue={false} name="isBannedForever">
          <Checkbox>Banned forever</Checkbox>
        </Form.Item>
        <Form.Item
          rules={[
            {
              type: 'array' as const,
              required: true,
              message: 'Times Banned not allow to be Empty..',
            },
          ]}
          name="datePicker"
          label="Start Date - End Date (Time Banned)"
          initialValue={[moment(), moment().add(1, 'days')]}
        >
          <RangePicker
            disabled={form?.getFieldValue('isBannedForever')}
            format="DD-MM-YYYY"
            disabledDate={disabledDate}
          />
        </Form.Item>
        <div>{`Your action will make user who was banned that can\'t login until after end day in schedule above.`}</div>
      </Form>
    </Modal>
  );
}
