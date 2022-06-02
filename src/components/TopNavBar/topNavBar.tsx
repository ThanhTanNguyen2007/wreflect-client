import React, { useContext, useEffect } from 'react';
import { Button, Select, PageHeader } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Board, Member, Team } from '../../types';
import { useQuery, useSubscription } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import {
  BoardSubscription,
  ColumnSubscription,
  OpinionSubscription,
  TeamSubscription,
} from '../../grapql-client/subcriptions';
import selfContext from '../../contexts/selfContext';
import { MemberMutations } from '../../grapql-client/mutations';
import { useTranslation } from 'react-i18next';
import {
  subOnUpdateMeetingNoteResult,
  subOnUpdateMeetingNoteVars,
} from '../../grapql-client/subcriptions/BoardSubscription';

const { Option } = Select;

type Props = {
  title: string;
  team: Team;
  iMember: Member;
  boardId?: string;
  selectedBoard?: Board | null;
  setSelectedBoard?: (selectedBoard: Board) => void;
};

const TopNavBar = ({ title, iMember, team, boardId }: Props) => {
  const history = useHistory();
  const me = useContext(selfContext);
  const { t, i18n } = useTranslation();

  useSubscription<TeamSubscription.subOnUpdateTeamResult, TeamSubscription.subOnUpdateTeamVars>(
    TeamSubscription.subOnUpdateTeam,
    {
      variables: {
        meId: me?.id,
        teamId: team?.id,
      },
    },
  );

  useSubscription<BoardSubscription.updateBoardResult, BoardSubscription.updateBoardVars>(
    BoardSubscription.updateBoard,
    {
      variables: {
        meId: me?.id,
        teamId: team?.id,
      },
    },
  );

  // useSubscription<BoardSubscription.deleteBoardResult, BoardSubscription.deleteBoardVars>(
  //   BoardSubscription?.deleteBoard,
  //   {
  //     variables: {
  //       meId: me?.id,
  //       teamId: team?.id,
  //     },
  //   },
  // );

  useSubscription<ColumnSubscription.subOnUpdateColumnResults, ColumnSubscription.subOnUpdateColumnVars>(
    ColumnSubscription.subOnUpdateColumn,
    {
      variables: {
        meId: me?.id,
        teamId: team?.id,
      },
    },
  );

  useSubscription<OpinionSubscription.updateOpinionResult, OpinionSubscription.updateOpinionVars>(
    OpinionSubscription.updateOpinion,
    {
      variables: {
        meId: me?.id,
        teamId: team?.id,
      },
    },
  );

  useSubscription<subOnUpdateMeetingNoteResult, subOnUpdateMeetingNoteVars>(BoardSubscription?.subOnUpdateMeetingNote, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('data is', subscriptionData?.data?.subOnUpdateMeetingNote);
    },
    variables: {
      teamId: team?.id,
      boardId: boardId,
    },
  });

  const handleSelectBoard = async (value: string) => {
    history.push(`/reflect/${team?.id}/${value}`);
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
        title={`Team ${team?.name}`}
        extra={
          <div className="flex flex-1 flex-dir-r flex-gap-10 flex-wrap">
            {handleRenderExtra()}
            <Link key="1" to={`/reflect/${team?.id}/${boardId || team?.boards[0]?.id}`}>
              <Button type={title == 'Do Reflect' ? 'primary' : undefined}>{t(`txt_reflectTeam`)}</Button>
            </Link>
            <Link key="2" to={`/personal-reflect/manage/${team?.id}`}>
              <Button type={title == 'Personal Reflection' ? 'primary' : undefined}>{t(`txt_reflectPersonal`)}</Button>
            </Link>
            <Link key="3" to={`/actions-tracker/${team?.id}`}>
              <Button type={title == 'Actions Tracker' ? 'primary' : undefined}>{t(`txt_actionTracker`)}</Button>
            </Link>
            <Link key="4" to={`/team-health/${team?.id}/${boardId || team?.boards[0]?.id}`}>
              <Button type={title == 'Health Check' ? 'primary' : undefined}>{t(`txt_healthCheck`)}</Button>
            </Link>
            <Link key="5" style={{ textDecoration: 'none' }} to={`/manage-members/${team?.id}`}>
              <Button type={title == 'Manage Members' ? 'primary' : undefined}>{t(`txt_members`)}</Button>
            </Link>
            {/* {(iMember?.isOwner || iMember?.isSuperOwner) && ( */}
            {/* <> */}
            <Link key="6" style={{ textDecoration: 'none' }} to={`/manage-board/${team?.id}`}>
              <Button type={title == 'Manage Board' ? 'primary' : undefined}>{t(`txt_boards`)}</Button>
            </Link>
            {/* </> */}
            {/* )} */}
            <Link key="7" style={{ textDecoration: 'none' }} to={`/team-details/${team?.id}`}>
              <Button type={title == 'Setting' ? 'primary' : undefined}>{t(`txt_setting`)}</Button>
            </Link>
          </div>
        }
      />
    </>
  );
};

export default TopNavBar;
