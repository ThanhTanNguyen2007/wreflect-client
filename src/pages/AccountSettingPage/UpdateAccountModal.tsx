import { useMutation } from '@apollo/client';
import { Form, Input, Modal, notification, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { t } from 'i18next';
import React, { useState } from 'react';
import config from '../../config';
import { UserMutations } from '../../grapql-client/mutations';
import { updateTeam } from '../../grapql-client/mutations/TeamMutations';
import { updateUserResult, updateUserVars } from '../../grapql-client/mutations/UserMutation';
import { User } from '../../types';

type Props = {
  userProfile: User;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function UpdateAccountModal({ userProfile, isVisible, setIsVisible }: Props) {
  const [isChanged, setIsChanged] = useState(false);
  const [form] = Form?.useForm();

  const [updateUser] = useMutation<updateUserResult, updateUserVars>(UserMutations?.updateUser, {
    onCompleted: () => {
      notification?.success({
        message: t('noti_update_success'),
      });
    },
    onError: (error) => {
      notification?.error({
        message: error?.message,
        placement: 'bottomRight',
      });
    },
  });

  const onHandleUpdate = () => {
    form?.validateFields().then(async (values) => {
      const nickname = values['nickname'];
      const gender = values['gender'];
      const introduction = values['introduction'];
      const workplace = values['workplace'];
      const interests = values['interests'];

      updateUser({
        variables: {
          nickname,
          gender,
          introduction,
          workplace,
          interests,
        },
      });
      setIsVisible(false);
    });
  };

  const onHandleChange = (changedValues: any, values: any) => {
    const nickname = values['nickname'];
    const gender = values['gender'];

    const introduction = values['introduction'];
    const workplace = values['workplace'];
    const interests = values['interests'];
    if (
      userProfile?.nickname?.trim() != nickname?.trim() ||
      userProfile?.gender?.trim() != gender?.trim() ||
      userProfile?.introduction != introduction ||
      userProfile?.workplace != workplace ||
      userProfile?.interests != interests
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
          nickName: userProfile?.nickname,
          introduction: userProfile?.introduction,
        }}
        onValuesChange={onHandleChange}
        preserve={false}
        form={form}
        layout="vertical"
      >
        <Form.Item name="nickname"></Form.Item>
        <Form.Item
          label={t(`txt_user_nickname`)}
          name={'nickname'}
          rules={[{ required: true, message: 'Name field is missing.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t(`txt_team_detail_desc`)}
          name={'gender'}
          rules={[{ required: true, message: 'Description field is missing' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label={t(`txt_team_detail_desc`)}
          name={'introduction'}
          rules={[{ required: true, message: 'Description field is missing' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label={t(`txt_team_detail_scope`)}
          name={'workplace'}
          rules={[{ required: true, message: 'Scope field is missing' }]}
        ></Form.Item>
        <Form.Item
          label={t(`txt_team_detail_duration`)}
          name={'interests'}
          rules={[{ required: true, message: 'Duration field is missing' }]}
        ></Form.Item>
      </Form>
    </Modal>
  );
}
