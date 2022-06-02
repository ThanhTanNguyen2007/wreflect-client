import { Upload, Modal, Form, notification } from 'antd';
import { t } from 'i18next';
import React, { useContext, useState } from 'react';
import selfContext from '../../contexts/selfContext';
import { InboxOutlined } from '@ant-design/icons';
import config from '../../config';
import { user } from '../../apis';
import { useForm } from 'rc-field-form';
import { useMutation } from '@apollo/client';
import { updateUserResult, updateUserVars } from '../../grapql-client/mutations/UserMutation';
import { UserMutations } from '../../grapql-client/mutations';

const { Dragger } = Upload;

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function UploadAvatarModal({ isVisible, setIsVisible }: Props) {
  const me = useContext(selfContext);
  const [form] = Form.useForm();
  const [pictureUrl, setPictureUrl] = useState(me?.picture);

  const [updateUser, { loading: isUpdating }] = useMutation<updateUserResult, updateUserVars>(
    UserMutations?.updateUser,
    {
      onCompleted: async () => {
        notification?.success({
          message: t('noti_delete_success'),
        });
        setIsVisible(false);
        await user?.me();
      },
      onError: (error) => {
        notification?.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const onHandleUpdate = async () => {
    form?.validateFields().then(async (values) => {
      const photo = values['photo'].file?.response || values['photo']?.fileList[0]?.response;
      updateUser({
        variables: {
          picture: photo,
        },
      });
    });
  };

  return (
    <Modal
      title={<h3 className="bold">{t(`txt_upload`)}</h3>}
      centered
      visible={isVisible}
      confirmLoading={isUpdating}
      destroyOnClose
      maskClosable
      okText="Update"
      onOk={onHandleUpdate}
      onCancel={() => setIsVisible(false)}
    >
      <Form form={form} initialValues={{ photo: me?.picture }}>
        <Form.Item rules={[{ required: true, message: 'Picture field is missing' }]} name="photo">
          <Dragger
            name="photo"
            action={`${config.SERVER_BASE_URL}/api/upload`}
            multiple={false}
            maxCount={1}
            listType="picture"
            defaultFileList={[
              {
                uid: '1',
                name: 'team.png',
                url: me?.picture,
              },
            ]}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}
