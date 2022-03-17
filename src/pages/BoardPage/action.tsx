import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { notification, Select } from 'antd';
import { OpinionMutations } from '../../grapql-client/mutations';
import { Board, Column, Opinion, OpinionStatus } from '../../types';

const { Option } = Select;

type Props = {
  board: Board;
  column: Column;
  opinion: Opinion;
};

export default function ActionComponent({ board, opinion }: Props) {
  const [myBoard, setBoard] = useState<Board>(board);
  const [myOpinion, setOpinion] = useState<Opinion>(opinion);

  const [updateOpinion] = useMutation<OpinionMutations.updateOpinionResult, OpinionMutations.updateOpinionVars>(
    OpinionMutations.updateOpinion,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
    },
  );

  useEffect(() => {
    setBoard(board);
    setOpinion(opinion);
  }, [opinion]);

  const handleRenderOptionMemberAssign = () => {
    return myBoard?.team?.members?.map((member) => (
      <Option key={member?.user?.id} value={member?.user?.id}>
        {member?.user?.nickname}
      </Option>
    ));
  };

  const handleSelectStatusOfAction = (value: string) => {
    updateOpinion({
      variables: {
        teamId: myBoard.teamId,
        opinionId: myOpinion.id,
        status: value as OpinionStatus,
      },
    });
  };

  const handleSelectResponsible = (value: string) => {
    updateOpinion({
      variables: {
        teamId: myBoard.teamId,
        opinionId: myOpinion.id,
        responsible: value,
      },
    });
  };

  return (
    <>
      <div className="opinionAction">
        <Select
          onSelect={handleSelectStatusOfAction}
          className="select"
          value={myOpinion?.status}
          style={{ width: 120 }}
        >
          <Option value="NEW">Open</Option>
          <Option value="IN_PROGRESS">In progress</Option>
          <Option value="DONE">Done</Option>
          <Option value="REJECTED">Rejected</Option>
        </Select>
        <Select
          onSelect={handleSelectResponsible}
          className="select"
          value={myOpinion.responsible}
          style={{ width: 120 }}
        >
          <Option value="not-assigned">Not Assigned</Option>
          {[...handleRenderOptionMemberAssign()]}
        </Select>
      </div>
    </>
  );
}
