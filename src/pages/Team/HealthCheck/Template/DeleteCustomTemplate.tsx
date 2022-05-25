import { useMutation } from '@apollo/client';
import { Form, Input, Modal, notification } from 'antd';
import React from 'react';
import { TemplateMutations } from '../../../../grapql-client/mutations';
import {
  deleteCustomTemplateResult,
  deleteCustomTemplateVars,
} from '../../../../grapql-client/mutations/TemplateMutation';
import { Template } from '../../../../types';

type Props = {
  template: Template;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function DeleteCustomTemplate({ template, isVisible, setIsVisible }: Props) {
  const [form] = Form?.useForm();

  const [deleteCustomTemplate, { loading: isDeleting }] = useMutation<
    deleteCustomTemplateResult,
    deleteCustomTemplateVars
  >(TemplateMutations?.deleteCustomTemplate, {
    refetchQueries: ['getTemplatesOfTeam'],
    onCompleted: () => {
      setIsVisible(false);
      notification.success({
        placement: 'bottomRight',
        message: 'Delete Successfully',
      });
    },
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
  });

  const onHandleDelete = async () => {
    form?.validateFields().then(async (values) => {
      const name = values['name'];
      if (!name || name !== template?.title) {
        return notification?.error({
          message: 'Input not match with name of template',
          placement: 'bottomRight',
        });
      }
      deleteCustomTemplate({
        variables: {
          teamId: template?.teamId,
          templateId: template?.id,
        },
      });
    });
  };

  return (
    <Modal
      title={<h3 className="bold">Delete Template</h3>}
      centered
      visible={isVisible}
      destroyOnClose
      maskClosable
      confirmLoading={isDeleting}
      okText="Delete"
      onOk={async () => await onHandleDelete()}
      onCancel={() => setIsVisible(false)}
    >
      <Form preserve={false} form={form}>
        <div>{`Please type "${template?.title}" to confirm delete`}</div>
        <Form.Item
          rules={[{ required: true, message: 'Please type the name of template for confirm deleting' }]}
          name={'name'}
        >
          <Input type={'text'} onPaste={() => false} onDrop={() => false} autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
}