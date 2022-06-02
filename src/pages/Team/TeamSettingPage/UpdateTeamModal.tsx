import { Button, DatePicker, Form, Input, Modal, notification, Select, Upload } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

import config from '../../../config';
import { Team } from '../../../types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { TeamMutations } from '../../../grapql-client/mutations';
import { updateTeamResult, updateTeamVars } from '../../../grapql-client/mutations/TeamMutations';
import _ from 'lodash';

type Props = {
  team: Team;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function UpdateTeamModal({ team: myTeam, isVisible, setIsVisible }: Props) {
  const [team, setTeam] = useState<Team | null>(myTeam);
  const [isChanged, setIsChanged] = useState(false);
  const { t } = useTranslation();
  const [form] = Form?.useForm();

  useEffect(() => {
    setTeam(myTeam);
  }, [myTeam]);

  const [updateTeam] = useMutation<updateTeamResult, updateTeamVars>(TeamMutations?.updateTeam, {
    onCompleted: () => {
      notification?.success({
        message: t(`noti_update_success`),
        placement: 'bottomRight',
      });
    },
    onError: (error) => {
      notification?.error({
        message: error?.message || 'Updating Team was failed',
        placement: 'bottomRight',
      });
    },
  });

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  function disabledDate(current: moment.Moment) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  const onHandleUpdate = () => {
    form?.validateFields().then(async (values) => {
      const name = values['name'];
      const description = values['description'];
      const startDate = values['duration'] && values['duration'][0] ? values['duration'][0] : moment();
      const endDate = values['duration'] && values['duration'][1] ? values['duration'][1] : moment();
      const isPublic = values['isPublic'] == 'public' ? true : false;
      const picture = values['upload'][0]?.response || values['upload'];

      updateTeam({
        variables: {
          teamId: team?.id,
          name,
          description,
          startDate,
          endDate,
          picture,
          isPublic,
        },
      });
      setIsVisible(false);
    });
  };

  const onHandleChange = (changedValues: any, values: any) => {
    const name = values['name'];
    const description = values['description'];
    const startDate = values['duration'] && values['duration'][0] ? values['duration'][0] : moment();
    const endDate = values['duration'] && values['duration'][1] ? values['duration'][1] : moment();
    const isPublic = values['isPublic'] == 'public' ? true : false;
    const picture = values['upload'][0]?.response || values['upload'];

    if (
      team?.name?.trim() != name?.trim() ||
      team?.description?.trim() != description?.trim() ||
      team?.startDate != startDate ||
      team?.endDate != endDate ||
      team?.isPublic != isPublic ||
      team?.picture != picture
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  return (
    <Modal
      title={`${t(`txt_edit`)} ${t(`txt_team`)}`}
      centered
      visible={isVisible}
      okText={t(`txt_update`)}
      destroyOnClose
      okButtonProps={{ disabled: !isChanged }}
      cancelText={t('txt_cancel')}
      onOk={onHandleUpdate}
      onCancel={() => {
        setIsVisible(false);
        setIsChanged(false);
      }}
    >
      <Form
        initialValues={{
          upload: team?.picture,
          name: team?.name,
          description: team?.description,
          isPublic: team?.isPublic ? 'public' : 'private',
          duration: [moment(+team?.startDate), moment(+team?.endDate)],
        }}
        onValuesChange={onHandleChange}
        preserve={false}
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="upload"
          valuePropName="file"
          initialValue={`${config.SERVER_BASE_URL}/uploads/teamDefault.png`}
          getValueFromEvent={normFile}
        >
          <Upload
            action={`${config.SERVER_BASE_URL}/api/upload`}
            name="photo"
            multiple={false}
            withCredentials={true}
            listType="picture"
            defaultFileList={[
              {
                uid: '1',
                name: 'team.png',
                url: team?.picture,
              },
            ]}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>{t(`txt_upload`)}</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label={t(`txt_team_detail_name`)}
          name={'name'}
          rules={[{ required: true, message: 'Name field is missing.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t(`txt_team_detail_desc`)}
          name={'description'}
          rules={[{ required: true, message: 'Description field is missing' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label={t(`txt_team_detail_scope`)}
          name={'isPublic'}
          rules={[{ required: true, message: 'Scope field is missing' }]}
        >
          <Select>
            <Option title={'Public'} value={'public'}>
              Public
            </Option>
            <Option title={'Private'} value={'private'}>
              Private
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t(`txt_team_detail_duration`)}
          name={'duration'}
          rules={[{ required: true, message: 'Duration field is missing' }]}
        >
          <RangePicker disabled={[true, false]} format="DD-MM-YYYY" disabledDate={disabledDate} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
