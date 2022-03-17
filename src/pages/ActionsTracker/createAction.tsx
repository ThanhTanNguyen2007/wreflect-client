import React from 'react';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, notification, Select } from 'antd';
import { OpinionMutations } from '../../grapql-client/mutations';
import { Team } from '../../types';

import { PlusCircleOutlined } from '@ant-design/icons';

type Props = {
  team: Team;
  selectedBoards: string[];
};

const { Option } = Select;

export default function CreateAction({ team, selectedBoards }: Props) {
  const [createOpinion] = useMutation<OpinionMutations.createOpinionResult, OpinionMutations.createOpinionVars>(
    OpinionMutations.createOpinion,
  );

  const handleOnFinish = (values: any) => {
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
  };
  return (
    <div>
      {selectedBoards.length == 1 && (
        <Form onFinish={handleOnFinish}>
          <div className="team actioncontainer">
            <Form.Item
              className="flex flex-dir-col flex-jc-start"
              style={{ flex: 7 }}
              name="title"
              rules={[{ required: true }]}
            >
              <Input size="middle" placeholder="Enter a title for Action Item" />
            </Form.Item>
            <Form.Item
              className="flex flex-dir-col flex-jc-start"
              style={{ flex: 3 }}
              name="column"
              rules={[{ required: true }]}
            >
              <Select bordered size="large" placeholder="Select Column...">
                {team?.boards
                  ?.find((board) => board.id === selectedBoards[0])
                  ?.columns.map((column) => {
                    if (column.isActive) {
                      return (
                        <Option key={column.id} value={column.id}>
                          {column.title}
                        </Option>
                      );
                    }
                  })}
              </Select>
            </Form.Item>
            <Button size="large" type="primary" htmlType="submit" icon={<PlusCircleOutlined />} style={{ flex: 2 }}>
              Create New
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
