import React, { useEffect, useState } from 'react';
import { Modal, DatePicker, Form, Steps, message, Button, FormInstance, Input, Select, Tooltip } from 'antd';
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { Assessment, Criteria, Team } from '../../../types';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { AssessmentMutations } from '../../../grapql-client/mutations';
import _ from 'lodash';
import Search from 'antd/lib/transfer/search';

type Props = {
  team: Team;
  assessment?: Assessment;
  criteriaData: Criteria[];
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
};

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function CreatingAssessmentModal({ assessment, criteriaData, team, isVisible, setVisible }: Props) {
  const [form] = Form.useForm();

  const [selectedCriteria, setSelectedCriteria] = useState(
    criteriaData?.map((criteriaData) => criteriaData.id).slice(0, 5),
  );

  const [createAssessment] = useMutation<
    AssessmentMutations.createAssessmentResult,
    AssessmentMutations.createAssessmentVars
  >(AssessmentMutations.createAssessment, {
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    setSelectedCriteria(criteriaData?.map((criteriaData) => criteriaData.id).slice(0, 5));
  }, [criteriaData]);

  const handleOnSelectCriteria = (newValue: any, oldValue: string) => {
    const temp = [...selectedCriteria];
    setSelectedCriteria(
      temp.map((criteria) => {
        if (criteria === oldValue) {
          return newValue;
        }
        return criteria;
      }),
    );
  };

  const handleCreate = () => {
    form.validateFields().then(async (values: any) => {
      const nameAssessment = values['name'];
      const startDate = values['range-picker'] && values['range-picker'][0] ? values['range-picker'][0] : moment();
      const endDate = values['range-picker'] && values['range-picker'][1] ? values['range-picker'][1] : moment();
      const criteriaList = values['names'];
      const memberIds = values['memberDoAssessment'];
      console.log('members is', memberIds);
      createAssessment({
        variables: {
          teamId: team?.id,
          startDate,
          endDate,
          nameAssessment,
          criteriaList,
          memberIds,
        },
        onCompleted: () => {
          setVisible(false);
          setSelectedCriteria(criteriaData?.map((criteriaData) => criteriaData.id).slice(0, 5));
        },
        refetchQueries: ['getAssessmentsList'],
        updateQueries: {
          getAssessmentsList: (previousData, { mutationResult }) => {
            return { getAssessmentsList: [mutationResult?.data?.createAssessment] };
          },
        },
      });
    });
  };

  function disabledDate(current) {
    return current && current < moment().startOf('day');
  }

  const handleOnSelectAssigners = (value: string) => {
    if (value === 'selectAll') {
      // setSelectedAssigners(team?.members?.map((member) => member?.user?.id) || []);
      form.setFieldsValue({ memberDoAssessment: team?.members?.map((member) => member?.id) || [] });
    }
  };

  const optionChildAssignees = team?.members.map((member) => {
    if (!member?.isPendingInvitation) {
      return (
        <Option key={member?.id} value={member?.id}>
          {member?.user?.nickname}
        </Option>
      );
    }
  });

  return (
    <Modal
      onCancel={() => {
        setVisible(false);
        setSelectedCriteria(criteriaData?.map((criteriaData) => criteriaData.id).slice(0, 5));
      }}
      width="1000px"
      visible={isVisible}
      closable
      centered
      bodyStyle={{ marginTop: '20px' }}
      destroyOnClose
      maskClosable={false}
      footer={
        <>
          <Button onClick={() => setVisible(false)}>Cancle</Button>
          {assessment ? (
            <Button onClick={() => console.log('updated')} type="primary" htmlType="submit">
              Update
            </Button>
          ) : (
            <Button onClick={() => handleCreate()} type="primary" htmlType="submit">
              Create
            </Button>
          )}
        </>
      }
    >
      <Form preserve={false} layout="vertical" form={form}>
        <div className="containerModal">
          <div className="settingEssentialInfor">
            <Form.Item
              label="Name"
              name={'name'}
              style={{ textAlign: 'start' }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="Please input name of assessment" />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ textAlign: 'start' }}
              name="range-picker"
              label="Start Date - End Date"
            >
              <RangePicker disabledDate={disabledDate} defaultValue={[moment(), null]} format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ textAlign: 'start' }}
              name="memberDoAssessment"
              label="Members"
              initialValue={
                team?.members?.map((member) => {
                  if (!member?.isPendingInvitation) return member?.id;
                }) || []
              }
            >
              <Select
                onSelect={handleOnSelectAssigners}
                showArrow
                allowClear
                onClear={() => form.setFieldsValue({ memberDoAssessment: [] })}
                placeholder="Select..."
                mode="multiple"
                style={{ width: '100%' }}
              >
                <Option key="selectAll" value="selectAll">
                  Select All
                </Option>
                {optionChildAssignees}
              </Select>
            </Form.Item>
          </div>
          <div className="setting-criteria">
            <h3>Criteria List:</h3>
            <Form.List
              name="names"
              initialValue={selectedCriteria}
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
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <Form.ErrorList errors={errors} />
                  {fields.map((field, index) => (
                    <Form.Item required={false} key={field.key}>
                      <div className="criteria">
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
                          <Select
                            onSelect={(value) =>
                              handleOnSelectCriteria(
                                value,
                                selectedCriteria?.find((criteria, index) => index === field?.key),
                              )
                            }
                            placeholder="Select a criteria"
                            style={{ width: 500 }}
                          >
                            {criteriaData?.map((criteria) => (
                              <Option
                                disabled={selectedCriteria.includes(criteria.id)}
                                key={criteria.id}
                                value={criteria.id}
                              >
                                {criteria.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Tooltip
                          trigger={['click']}
                          placement="bottom"
                          title={
                            criteriaData?.find(
                              (criteria) =>
                                criteria?.id === selectedCriteria?.find((criteria, index) => index === field?.key),
                            )?.description
                          }
                        >
                          <QuestionCircleOutlined className="dynamic-delete-button" />
                        </Tooltip>
                        {fields.length > 5 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                              remove(field.name);
                              setSelectedCriteria(
                                [...selectedCriteria].filter((criteria, index) => index != field.name),
                              );
                            }}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}
                  <div>
                    <div className="actionOfCriteriaList">
                      <Button
                        type="dashed"
                        onClick={() => {
                          // if (criteriaData?.length === selectedCriteria.length) {
                          // } else {
                          const addedCriteria = criteriaData?.filter(
                            (criteria) => !selectedCriteria.includes(criteria?.id),
                          )[0]?.id;
                          if (addedCriteria) {
                            add(addedCriteria);
                            setSelectedCriteria([...selectedCriteria, addedCriteria]);
                          }
                          // }
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                      <Button
                        type="dashed"
                        onClick={() => {
                          const addedCriteria = criteriaData?.filter(
                            (criteria) => !selectedCriteria.includes(criteria?.id),
                          )[0]?.id;
                          console.log('criteria', addedCriteria);
                          if (addedCriteria) {
                            add(addedCriteria, 0);
                            setSelectedCriteria([addedCriteria, ...selectedCriteria]);
                          }
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add field at head
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
