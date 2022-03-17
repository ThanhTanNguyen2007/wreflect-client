import React, { useState } from 'react';
import { Modal, DatePicker, Form, Steps, message, Button, FormInstance, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { Criteria, Team } from '../../../types';

type Props = {
  team: Team;
  criteriaData: Criteria[];
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
};

const { Step } = Steps;
const { RangePicker } = DatePicker;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const steps = [
  {
    title: 'First',
    content: function test(team: Team, criteriaData: Criteria[]) {
      return (
        <>
          <Form.Item label="Team Id" name={'teamId'} initialValue={team?.id}>
            <Input disabled placeholder="" />
          </Form.Item>
          <Form.Item
            label="Name"
            name={'name'}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            style={{ textAlign: 'start' }}
            name="range-time-picker"
            label="Start Date - End Date"
          >
            <RangePicker format="YYYY-MM-DD" />
          </Form.Item>
        </>
      );
    },
  },
  {
    title: 'Second',
    content: function test(team: Team, criteriaData: Criteria[]) {
      return (
        <>
          <Form.List
            name="names"
            initialValue={criteriaData.map((criteriaData) => criteriaData.id).slice(0, 5)}
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 5) {
                    return Promise.reject(new Error('At least 5 criteria'));
                  }
                },
              },
              {
                validator: async (_, names) => {
                  if (names && names.length > 9) {
                    return Promise.reject(new Error('At maxium 9 criteria'));
                  }
                },
              },

              //   {
              //     validator: async (_, names) => {
              //       console.log('name', names);
              //       const toFindDuplicates = (arry) => arry.filter((item, index) => arry.indexOf(item) !== index);
              //       const duplicateElementa = toFindDuplicates(names);
              //       console.log('duplicated data', duplicateElementa);
              //       if (duplicateElementa.length > 0) {
              //         return Promise.reject(new Error("Criteria's duplicated"));
              //       }
              //     },
              //   },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                <Form.ErrorList errors={errors} />
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Criteria List' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: "Please select criteria's name or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Select placeholder="Select a criteria" style={{ width: 500 }}>
                        {criteriaData?.map((criteria) => (
                          <Option key={criteria.id} value={criteria.id}>
                            {criteria.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />
                    ) : null}
                  </Form.Item>
                ))}
                <div className="flex flex-ai-c flex-jc-c">
                  <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />}>
                    Add field
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add(criteriaData[0].id, 0);
                    }}
                    style={{ width: '60%', marginTop: '20px' }}
                    icon={<PlusOutlined />}
                  >
                    Add field at head
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        </>
      );
    },
  },
];

export default function CreatingAssessmentModal({ criteriaData, team, isVisible, setVisible }: Props) {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const handleOnFinish = () => {
    form.validateFields().then(async (values: any) => {
      console.log(values);
    });
  };

  const handleOnNext = () => {
    form.validateFields().then(async (values: any) => {
      next();
    });
  };

  return (
    <Modal
      onCancel={() => {
        setVisible(false);
        setCurrent(0);
      }}
      width="700px"
      visible={isVisible}
      closable
      centered
      bodyStyle={{ marginTop: '20px' }}
      destroyOnClose
      maskClosable={false}
      footer={
        <>
          <div className="steps-action">
            <Button onClick={() => setVisible(false)}>Cancle</Button>
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  handleOnNext();
                }}
              >
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit" onClick={() => handleOnFinish()}>
                Done
              </Button>
            )}
          </div>
        </>
      }
    >
      <Form
        {...layout}
        layout="horizontal"
        form={form}
        // initialValues={{ names: criteriaData.map((criteriaData) => criteriaData.id).slice(0, 5) }}
      >
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content" style={{ marginTop: '50px' }}>
          {steps[current].content(team, criteriaData)}
        </div>
      </Form>
    </Modal>
  );
}
