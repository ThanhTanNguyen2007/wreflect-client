import React from 'react';
import { Button, Select, PageHeader } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Board, Team } from '../../types';
import { useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';

const { Option } = Select;

type Props = {
  title: string;
  team?: Team;
  boardId?: string;
  selectedBoard?: Board | null;
  setSelectedBoard?: (selectedBoard: Board) => void;
};

const TopNavBar = ({ title, team, boardId }: Props) => {
  const history = useHistory();

  const handleSelectBoard = async (value: string) => {
    history.push(`/board/${team?.id}/${value}`);
  };

  const boardOptions = () => {
    return team?.boards?.map((board) => (
      <Option key={board.id} value={board.id}>
        {board.title}
      </Option>
    ));
  };

  const handleRenderExtra = () => {
    switch (title) {
      case 'Manage Members':
        return [];
      case 'Do Reflect':
        return [
          <Select
            onSelect={handleSelectBoard}
            placeholder="Select board"
            key="selectBoard"
            // defaultActiveFirstOption={selectedBoard?.id || undefined}
            style={{ width: 200 }}
            bordered
            optionFilterProp="children"
            defaultValue={boardId || ''}
          >
            {boardOptions()}
          </Select>,
        ];

      default:
        return [];
    }
  };

  return (
    <>
      <PageHeader
        className="topNavBar"
        onBack={() => history.replace('/teams')}
        title={title}
        extra={[
          ...handleRenderExtra(),
          <Link key="1" to={`/board/${team?.id}/${boardId || team?.boards[0]?.id}`}>
            <Button type={title == 'Do Reflect' ? 'primary' : undefined}>Reflect</Button>
          </Link>,
          <Link key="2" to={`/personal-reflect/manage/${team?.id}`}>
            <Button type={title == 'Personal Reflection' ? 'primary' : undefined}>Personal</Button>
          </Link>,
          <Link key="3" to={`/actions-tracker/${team?.id}`}>
            <Button type={title == 'Actions Tracker' ? 'primary' : undefined}>Actions Tracker</Button>
          </Link>,
          <Link key="4" to={`/team-health/${team?.id}/${boardId || team?.boards[0]?.id}`}>
            <Button type={title == 'Health Check' ? 'primary' : undefined}>Health Check</Button>
          </Link>,
          <Link key="5" style={{ textDecoration: 'none' }} to={`/manage-members/${team?.id}`}>
            <Button type={title == 'Manage Members' ? 'primary' : undefined}>Members</Button>
          </Link>,
          <Link key="6" style={{ textDecoration: 'none' }} to={`/manage-board/${team?.id}`}>
            <Button type={title == 'Manage Board' ? 'primary' : undefined}>Board</Button>
          </Link>,
          <Link key="6" style={{ textDecoration: 'none' }} to={`/team-details/${team?.id}`}>
            <Button type={title == 'Setting' ? 'primary' : undefined}>Settings</Button>
          </Link>,
        ]}
      />
    </>
  );
};

export default TopNavBar;
