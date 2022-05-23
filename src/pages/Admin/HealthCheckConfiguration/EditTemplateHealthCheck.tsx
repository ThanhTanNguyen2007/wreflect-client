import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Button, FormInstance, notification } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useMutation } from '@apollo/client';
import { Template } from '../../../types';
import { TemplateMutations } from '../../../grapql-client/mutations';
import { updateTemplateResult, updateTemplateVars } from '../../../grapql-client/mutations/TemplateMutation';

type Props = {
  template: Template;
  setTemplate: (value: Template) => void;
};
const colorPicker = ['pink', 'lpink', 'orange', 'lblue', 'blue', 'green', 'purple'];
const { TextArea } = Input;

export default function EditTemplateHealthCheck({ template, setTemplate }: Props) {
  const form = useRef<FormInstance>(null);


  const [updateTemplate, { loading: updateLoading }] = useMutation<updateTemplateResult, updateTemplateVars>(
    TemplateMutations?.updateTemplate,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
    },
  );

  const onHandleUpdate = () => {
    form.current.validateFields().then(async (values: any) => {
      const name = values['name'];
      const questions = values['questions'];
      updateTemplate({
        variables: {
          templateId: template.id,
          name,
          questions: questions?.map((x, index) => ({
            ...x,
            color: onHandleGenerateColor(index),
          })),
        },
        onCompleted: () => {
          setTemplate(null);
        },
      });
    });
  };

  const onHandleGenerateColor = (index: number) => {
    let tempIndex = index;
    while (tempIndex > colorPicker?.length - 1) {
      tempIndex = tempIndex - colorPicker.length;
    }
    return colorPicker[tempIndex];
  };

  return (
    <>
      <Modal
        className="updateHealthCheckModal "
        title={<h3 className="bold">Update Template {template?.title?.toUpperCase()}</h3>}
        centered
        visible={!!template}
        destroyOnClose
        onCancel={() => setTemplate(null)}
        footer={
          <>
            <Button onClick={() => setTemplate(null)}>Cancle</Button>
            <Button loading={updateLoading} type="primary" onClick={async () => await onHandleUpdate()}>
              Update
            </Button>
          </>
        }
        width={1000}
      >
        <Form
          //   initialValues={{
          //     name: template?.title,
          //     questions: template?.healthCheckQuestions?.map((q) => ({
          //       id: q?.id,
          //       title: q?.title,
          //       color: q?.color,
          //       description: q?.description,
          //     })),
          //   }}
          preserve={false}
          className="flex flex-gap-24"
          ref={form}
        >
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
              is: q?.id,
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
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div
                    key={field.name}
                    className={`flex flex-1 flex-dir-r flex-ai-bl flex-gap-10 p-20 ${onHandleGenerateColor(index)}`}
                  >
                    <Form.Item name={[field.name, 'color']} style={{ width: 0 }} />
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
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add sights
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}
