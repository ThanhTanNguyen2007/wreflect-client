import React, { useRef } from 'react';
import { Button, Form, Input, Modal, notification, FormInstance } from 'antd';

import { Criteria } from '../../../types';
import { useMutation } from '@apollo/client';
import { CriteriaMutations } from '../../../grapql-client/mutations';
import { updateCriteriaResult, updateCriteriaVars } from '../../../grapql-client/mutations/CriteriaMutations';

type Props = {
  criteria: Criteria;
  setCriteria: (criteria: Criteria) => void;
};

export default function EditCriteriaModal({ criteria, setCriteria }: Props) {
  const form = useRef<FormInstance>();

  const [updateCriteria, { loading: isUpdating }] = useMutation<updateCriteriaResult, updateCriteriaVars>(
    CriteriaMutations?.updateCriteria,
    {
      onError: (error) => {
        notification?.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const onHanldeUpdate = async () => {
    form?.current?.validateFields().then(async (values: any) => {
      const criteriaName = values['name'];
      const criteriaDescription = values['description'];

      await updateCriteria({
        variables: {
          criteriaId: criteria?.id,
          name: criteriaName,
          description: criteriaDescription,
        },
      });

      setCriteria(null);
    });
  };

  return (
    <Modal
      className="updateHealthCheckModal "
      title={<h3 className="bold">Update Template {criteria?.name?.toUpperCase()}</h3>}
      centered
      visible={!!criteria}
      destroyOnClose
      onCancel={() => setCriteria(null)}
      footer={
        <>
          <Button onClick={() => setCriteria(null)}>cancel</Button>
          <Button loading={isUpdating} type="primary" onClick={async () => await onHanldeUpdate()}>
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
          initialValue={criteria?.name}
          rules={[{ required: true, message: 'Criteria Name must not empty.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="mt-25"
          name="description"
          label="Criteria Description"
          initialValue={criteria?.description}
          rules={[{ required: true, message: 'Criteria Description must not empty.' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
