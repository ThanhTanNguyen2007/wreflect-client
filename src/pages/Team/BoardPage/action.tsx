import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Avatar, notification, Select } from 'antd';
import { OpinionMutations } from '../../../grapql-client/mutations';
import { Board, Column, Member, Opinion, OpinionStatus, Team } from '../../../types';

const { Option } = Select;

type Props = {
  team: Team;
  iMember: Member;
  board: Board;
  column: Column;
  opinion: Opinion;
};

export default function ActionComponent({ team, iMember, board, opinion }: Props) {
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
    return team?.members
      .filter((member) => !member.isPendingInvitation)
      ?.map((member) => (
        <Option key={member?.user?.id} value={member?.user?.id}>
          <Avatar style={{ marginRight: '5px' }} shape="square" src={member?.user?.picture} size={15} />
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
      <div className="opinionAction mt-25">
        <Select
          onSelect={handleSelectStatusOfAction}
          className="select"
          disabled={
            !(
              iMember?.isOwner ||
              iMember?.isSuperOwner ||
              opinion?.responsible == iMember?.id ||
              opinion?.authorId == iMember?.id
            )
          }
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
          disabled={
            !(
              iMember?.isOwner ||
              iMember?.isSuperOwner ||
              opinion?.responsible == iMember?.id ||
              opinion?.authorId == iMember?.id
            )
          }
        >
          <Option value="not-assigned">Not Assigned</Option>
          {[...handleRenderOptionMemberAssign()]}
        </Select>
      </div>
    </>
  );
}
