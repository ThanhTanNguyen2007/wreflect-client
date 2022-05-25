import React from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification } from 'antd';
import { Template } from '../../../../types';
import { useMutation } from '@apollo/client';
import { TemplateMutations } from '../../../../grapql-client/mutations';
import {
  updateCustomTemplateResult,
  updateCustomTemplateVars,
} from '../../../../grapql-client/mutations/TemplateMutation';

type Props = {
  template: Template;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};
const { TextArea } = Input;
const colorPicker = ['pink', 'lpink', 'orange', 'lblue', 'blue', 'green', 'purple'];

export default function UpdateCustomTemplate({ template, isVisible, setIsVisible }: Props) {
  const [form] = Form?.useForm();

  const [updateCustomTemplate, { loading: isUpdating }] = useMutation<
    updateCustomTemplateResult,
    updateCustomTemplateVars
  >(TemplateMutations?.updateCustomTemplate, {
    onCompleted: () => {
      setIsVisible(false);
      notification.success({
        placement: 'bottomRight',
        message: 'Update Successfully',
      });
    },
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
  });

  const onHandleUpdate = () => {
    form?.validateFields().then(async (values) => {
      const name = values['name'];
      const questions = values['questions'];
      updateCustomTemplate({
        variables: {
          teamId: template?.teamId,
          templateId: template?.id,
          name,
          questions,
        },
      });
    });
  };
  const onHandleGenerateColor = (index: number) => {
    let tempIndex = index;
    while (tempIndex > colorPicker?.length - 1) {
      tempIndex = tempIndex - colorPicker?.length;
    }
    return colorPicker[tempIndex];
  };

  return (
    <Modal
      title={<h3 className="bold">Create New Custom Default For Your Team</h3>}
      centered
      visible={isVisible}
      destroyOnClose
      maskClosable
      okText="Update"
      confirmLoading={isUpdating}
      onOk={async () => await onHandleUpdate()}
      onCancel={() => setIsVisible(false)}
      width={1000}
    >
      <Form preserve={false} className="flex flex-gap-24" form={form}>
        <Form.Item
          initialValue={template?.title}
          label="Name"
          name={'name'}
          rules={[{ required: true, message: 'Missing Name' }]}
        >
          <Input />
        </Form.Item>
        <Form.List
          initialValue={template?.healthCheckQuestions?.map((q) => ({
            id: q?.id,
            title: q?.title,
            color: q?.color,
            description: q?.description,
          }))}
          name="questions"
          rules={[
            {
              validator: async (_, questions) => {
                if (!questions || questions.length < 5) {
                  return Promise.reject(new Error('At least 5 questions'));
                }
              },
            },
            {
              validator: async (_, questions) => {
                if (questions && questions.length > 20) {
                  return Promise.reject(new Error('At maxium 20 questions'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              <Form.ErrorList errors={errors} />
              {fields.map((field, index) => (
                <div
                  key={field.name}
                  className={`flex flex-1 flex-dir-r flex-ai-bl flex-gap-10 p-20 ${onHandleGenerateColor(index)}`}
                >
                  <Form.Item
                    label="Title"
                    className="flex-1"
                    name={[field.name, 'title']}
                    rules={[{ required: true, message: 'Title not allow empty.' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    className="flex-2 flex flex-dir-r flex-ai-st"
                    name={[field.name, 'description']}
                    rules={[{ required: true, message: 'Description not allow empty.' }]}
                  >
                    <TextArea style={{ height: '32px' }} />
                  </Form.Item>
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </div>
              ))}
              <Button
                size="large"
                type="dashed"
                onClick={() => {
                  add();
                }}
                block
                icon={<PlusOutlined />}
              >
                Add Question
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
