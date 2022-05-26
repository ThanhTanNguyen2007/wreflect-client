import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Card, Form, Input, notification, Select } from 'antd';
import { OpinionMutations } from '../../../grapql-client/mutations';
import { Team } from '../../../types';

import { PlusCircleOutlined } from '@ant-design/icons';

type Props = {
  team: Team;
  selectedBoards: string[];
};

const { Option } = Select;

export default function CreateAction({ team, selectedBoards }: Props) {
  const [createOpinion] = useMutation<OpinionMutations.createOpinionResult, OpinionMutations.createOpinionVars>(
    OpinionMutations.createOpinion,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleOnFinish = (values: any) => {
    setLoading(true);
    setDisabled(true);
    setTimeout(() => {
      createOpinion({
        variables: {
          teamId: team.id,
          boardId: selectedBoards[0],
          columnId: values['column'],
          text: values['title'],
          isAction: true,
          isCreateBottom: false,
        },
        onCompleted: () => {
          setLoading(false);
          setDisabled(false);
          notification.success({
            message: 'Create an Action Iteam successfully',
            placement: 'bottomRight',
          });
        },
        onError: (error) => {
          notification.error({
            placement: 'bottomRight',
            message: error.message,
          });
        },
      });
    }, 2000);
  };
  return (
    <div className="mb-10">
      {selectedBoards.length == 1 && (
        <Form onFinish={handleOnFinish}>
          <Card hoverable>
            <div className="flex flex-1 flex-dir-r flex-gap-10">
              <Form.Item name="title" rules={[{ required: true }]}>
                <Input size="middle" placeholder="Enter a title for Action Item" />
              </Form.Item>
              <Form.Item name="column" rules={[{ required: true }]}>
                <Select bordered size="large" placeholder="Select Column...">
                  {team?.boards
                    ?.find((board) => board?.id === selectedBoards[0])
                    ?.columns?.map((column) => {
                      if (column?.isActive) {
                        return (
                          <Option key={column?.id} value={column?.id}>
                            {column?.title}
                          </Option>
                        );
                      }
                    })}
                </Select>
              </Form.Item>
              <Button
                className="bold"
                style={{ width: '200px' }}
                loading={loading}
                size="large"
                disabled={disabled}
                type="primary"
                htmlType="submit"
                icon={<PlusCircleOutlined />}
              >
                Create New
              </Button>
            </div>
          </Card>
        </Form>
      )}
    </div>
  );
}
