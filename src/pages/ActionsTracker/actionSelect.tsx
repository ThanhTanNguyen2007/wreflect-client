import React from 'react';

import { notification, Select } from 'antd';
import { Board, Column, Opinion, Team } from '../../types';
import { useMutation } from '@apollo/client';
import { OpinionMutations } from '../../grapql-client/mutations';

type Props = {
  team: Team;
  board: Board;
  column: Column;
  opinion: Opinion;
};

const { Option } = Select;

export default function ActionSelect({ team, board, column, opinion }: Props) {
  const [updateOpinion] = useMutation<OpinionMutations.updateOpinionResult, OpinionMutations.updateOpinionVars>(
    OpinionMutations.updateOpinion,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const renderListAssignees = team.members.map((member) => (
    <Option value={member.user.id} key={member.id}>
      {member?.user?.nickname}
    </Option>
  ));

  const renderListBoards = team.boards.map((board) => (
    <Option value={board.id} key={board.id}>
      {board.title}
    </Option>
  ));

  const renderListColumn = board.columns.map((column) => {
    if (column.isActive) {
      return (
        <Option value={column.id} key={column.id}>
          {column.title}
        </Option>
      );
    }
  });

  const handleOnSelectAssignee = (value: string) => {
    updateOpinion({
      variables: {
        opinionId: opinion.id,
        teamId: team.id,
        responsible: value,
      },
    });
  };

  const handleOnSelectBoard = (value: string) => {
    updateOpinion({
      variables: {
        opinionId: opinion.id,
        teamId: team.id,
        newColumnId: team.boards.find((board) => board.id === value)?.columns[0].id,
      },
    });
  };

  const handleOnSelectColumn = (value: string) => {
    updateOpinion({
      variables: {
        opinionId: opinion.id,
        teamId: team.id,
        newColumnId: value,
      },
    });
  };

  return (
    <div className="flex flex-dir-col flex-jc-c flex-ai-c">
      <div style={{ margin: '5px', width: '100%' }}>
        <Select
          onSelect={handleOnSelectAssignee}
          className="select"
          value={opinion.responsible}
          style={{ width: '100%' }}
        >
          {renderListAssignees}
        </Select>
      </div>
      <div className="opinionAction">
        <Select onSelect={handleOnSelectBoard} className="select" value={board.id} style={{ width: 120 }}>
          {renderListBoards}
        </Select>
        <Select onSelect={handleOnSelectColumn} className="select" value={column?.id} style={{ width: 120 }}>
          {renderListColumn}
        </Select>
      </div>
    </div>
  );
}
