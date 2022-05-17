import React from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification } from 'antd';
import { useMutation } from '@apollo/client';
import {
  createCustomTemplateForTeamVars,
  createCustomTemplateForTeamResult,
  createTemplateHealthCheckResult,
  createTemplateHealthCheckVars,
} from '../../../grapql-client/mutations/TemplateMutation';
import { TemplateMutations } from '../../../grapql-client/mutations';

const { TextArea } = Input;
type Props = {
  teamId: string;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
};

const colorPicker = ['pink', 'lpink', 'orange', 'lblue', 'blue', 'green', 'purple'];

export default function CreateCustomHealthCheckModal({ teamId, isVisible, setIsVisible }: Props) {
  const [form] = Form?.useForm();

  const [createCustomTemplate] = useMutation<createCustomTemplateForTeamResult, createCustomTemplateForTeamVars>(
    TemplateMutations.createCustomTemplateForTeam,
    {
      onCompleted: () => {
        setIsVisible(false);
      },
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
    },
  );

  const onHanldeCreate = async () => {
    form?.validateFields().then(async (values) => {
      const name = values['name'];
      const questions = values['questions'];
      createCustomTemplate({
        variables: {
          teamId,
          name,
          questions,
        },
        refetchQueries: ['getTemplatesOfTeam'],
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
      className="createHealthCheckModal flex-jc-c "
      title={<h3 className="bold">Create New Custom Default For Your Team</h3>}
      centered
      destroyOnClose
      maskClosable
      onOk={async () => await onHanldeCreate()}
      visible={isVisible}
      onCancel={() => setIsVisible(false)}
      width={1000}
    >
      <Form preserve={false} className="flex flex-gap-24" form={form}>
        <Form.Item label="Name" name={'name'} rules={[{ required: true, message: 'Missing Name' }]}>
          <Input />
        </Form.Item>
        <Form.List
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
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Question
                </Button>
              </Form.Item>
              <Form.ErrorList errors={errors} />
              {fields.map((field, index) => {
                const colorOfQuestion = onHandleGenerateColor(index);
                return (
                  <>
                    <div
                      key={field.key}
                      className={`flex flex-1 flex-dir-r flex-ai-bl flex-gap-10 p-20 ${colorOfQuestion}`}
                    >
                      <Form.Item
                        {...field}
                        initialValue={colorOfQuestion}
                        name={[field.name, 'color']}
                        rules={[{ required: true, message: 'Title not allow empty.' }]}
                        style={{ width: 0 }}
                      />
                      <Form.Item
                        {...field}
                        label="Title"
                        className="flex-1"
                        name={[field.name, 'title']}
                        rules={[{ required: true, message: 'Title not allow empty.' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Description"
                        className="flex-2 flex flex-dir-r flex-ai-st"
                        name={[field.name, 'description']}
                        rules={[{ required: true, message: 'Description not allow empty.' }]}
                      >
                        <TextArea style={{ height: '32px' }} />
                      </Form.Item>

                      <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                    </div>
                  </>
                );
              })}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
