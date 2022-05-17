import React, { useRef } from 'react';
import { Button, Form, Input, Modal, notification, FormInstance } from 'antd';

import { Criteria } from '../../../types';
import { useMutation } from '@apollo/client';
import {
  createCriteriaResult,
  createCriteriaVars,
  updateCriteriaResult,
  updateCriteriaVars,
} from '../../../grapql-client/mutations/CriteriaMutations';
import { CriteriaMutations } from '../../../grapql-client/mutations';
import { onError } from '@apollo/client/link/error';

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};
const { TextArea } = Input;

export default function CreateCriteriaModal({ isVisible, setIsVisible }: Props) {
  const form = useRef<FormInstance>();

  const [createCriteria, { loading: isCreating }] = useMutation<createCriteriaResult, createCriteriaVars>(
    CriteriaMutations?.createCriteria,
    {
      refetchQueries: ['getCriteriaList'],
      onError: (error) => {
        notification?.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const onHandleCreate = () => {
    form?.current?.validateFields().then(async (values: any) => {
      const criteriaName = values['name'];
      const criteriaDescription = values['description'];

      await createCriteria({
        variables: {
          name: criteriaName,
          description: criteriaDescription,
        },
      });

      setIsVisible(false);
    });
  };

  return (
    <Modal
      className="updateHealthCheckModal "
      title={<h3 className="bold">Create New Criteria</h3>}
      centered
      visible={isVisible}
      destroyOnClose
      onCancel={() => setIsVisible(false)}
      footer={
        <>
          <Button onClick={() => setIsVisible(false)}>cancel</Button>
          <Button loading={isCreating} type="primary" onClick={async () => await onHandleCreate()}>
            Update
          </Button>
        </>
      }
      width={1000}
    >
      <Form layout="vertical" ref={form}>
        <Form.Item
          name="name"
          label="Criteria Name"
          rules={[{ required: true, message: 'Criteria Name must not empty.' }]}
        >
          <Input placeholder="Criteria name input here..." />
        </Form.Item>
        <Form.Item
          className="mt-25"
          name="description"
          label="Criteria Description"
          rules={[{ required: true, message: 'Criteria Description must not empty.' }]}
        >
          <TextArea placeholder="Criteria description input here..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
