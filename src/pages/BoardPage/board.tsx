import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Tooltip, Empty, Badge, Spin, notification } from 'antd';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import ColumnComponent from './column';
import { BoardMutations, ColumnMutations, OpinionMutations } from '../../grapql-client/mutations';
import {
  MenuOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  EditOutlined,
  BulbOutlined,
  UngroupOutlined,
  CrownFilled,
  LikeOutlined,
  MessageOutlined,
  FieldTimeOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  SnippetsOutlined,
  StarOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import selfContext from '../../contexts/selfContext';
import { ConfigBoardModal } from '../configBoardModal';
import { Loading } from '../../components/Loading';
import { TopNavBar } from '../../components/TopNavBar';
import ConfigTimeTrackingModal from './configTimeTrackingModal';
import { CountDown } from '../../components/CountDown';
import { Board } from '../../types';
import ModalMeetingNote from './modalMeetingNote';
import { isMemberName } from 'typescript';
import moment from 'moment';

type Props = {
  teamId: string;
  boardId: string;
};

export default function board({ teamId, boardId }: Props) {
  const [board, setBoard] = useState<Board | null>(null);
  const [isBoardPanelActive, setIsBoardPanelActive] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isTimeTrackingModalVisible, setTimeTrackingModalVisible] = useState(false);
  const history = useHistory();
  const client = useApolloClient();
  const me = useContext(selfContext);
  const [currentNumVotes, setCurrentNumVotes] = useState(0);

  const [isVisibleMeetingNote, setIsVisibleMeetingNote] = useState(false);

  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: {
        teamId,
      },
      fetchPolicy: 'cache-and-network', // Used for first execution
      nextFetchPolicy: 'cache-only',
      onCompleted: (data) => {
        setBoard(data?.team?.boards?.find((board) => board?.id === boardId) || null);
      },
    },
  );

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  useEffect(() => {
    setBoard(data?.team?.boards?.find((board) => board?.id === boardId) || null);
  }, [teamId, boardId]);

  useEffect(() => {
    const value = board?.columns?.reduce(
      (prev, curr) =>
        prev +
        curr.opinions.reduce((prevOp, currOp) => prevOp + currOp.upVote.filter((id) => id === iMember?.id).length, 0),
      0,
    );
    if (value && iMember?.id) {
      setCurrentNumVotes(value);
    }
  }, [data]);

  const [updateBoard] = useMutation<BoardMutations.updateBoardResult, BoardMutations.updateBoardVars>(
    BoardMutations.updateBoard,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const [orderOpinion] = useMutation<ColumnMutations.orderOpinionResult, ColumnMutations.orderOpinionVars>(
    ColumnMutations.orderOpinion,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const [combineOpinion] = useMutation<OpinionMutations.combineOpinionResult, OpinionMutations.combineOpinionVars>(
    OpinionMutations.combineOpinion,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const handleOnDragEnd = async (result: DropResult) => {
    const prevList = _.cloneDeep(board?.columns);
    const tempList = _.cloneDeep(board?.columns);
    if (result.combine) {
      let combineText = '';
      const currentColumn = tempList?.find((column) => column.id === result.combine?.droppableId);
      if (!currentColumn?.opinions) return;
      const sourceOpinion = tempList
        ?.find((column) => column.id == result.source?.droppableId)
        ?.opinions.splice(result.source.index, 1);
      if (!sourceOpinion || sourceOpinion.length <= 0) return;
      currentColumn.opinions = currentColumn?.opinions.map((opinion) => {
        if (opinion.id === result.combine?.draggableId) {
          combineText = `${opinion?.text}\n${sourceOpinion[0]?.text}`;
          return {
            ...opinion,
            text: combineText,
            upVote: [...opinion.upVote, ...sourceOpinion[0].upVote],
            mergedAuthors: [...opinion.mergedAuthors, sourceOpinion[0]?.authorId],
            remarks: [...opinion.remarks, ...sourceOpinion[0]?.remarks],
          };
        }
        return opinion;
      });

      client.cache.writeQuery({
        query: BoardQueries.getBoard,
        variables: {
          boardId,
        },
        data: {
          board: { ...board, columns: tempList },
        },
      });

      combineOpinion({
        variables: {
          teamId: data?.team?.id,
          boardId: board?.id,
          combine: result?.combine,
          source: result?.source,
          draggableId: result?.draggableId,
          text: combineText,
        },
        onError: () => {
          client.cache.writeQuery({
            query: BoardQueries?.getBoard,
            variables: {
              boardId,
            },
            data: {
              board: prevList,
            },
          });
        },
      });
    } else {
      if (!result.destination) return;

      const reorderedItem = tempList
        ?.find((column) => column.id === result.source.droppableId)
        ?.opinions?.splice(result.source.index, 1);
      if (!reorderedItem || reorderedItem.length <= 0) return;
      tempList
        ?.find((column) => column.id === result.destination?.droppableId)
        ?.opinions.splice(result?.destination?.index, 0, reorderedItem[0]);

      client.cache.writeQuery({
        query: BoardQueries.getBoard,
        variables: {
          boardId,
        },
        data: {
          board: { ...board, columns: tempList },
        },
      });

      orderOpinion({
        variables: {
          teamId: data?.team?.id,
          boardId: board.id,
          destination: result?.destination,
          source: result?.source,
          draggableId: result?.draggableId,
        },
        onError: () => {
          client.cache.writeQuery({
            query: BoardQueries.getBoard,
            variables: {
              boardId,
            },
            data: {
              board: prevList,
            },
          });
        },
      });
    }
  };

  return (
    <>
      <TopNavBar
        iMember={iMember}
        team={data?.team}
        boardId={boardId}
        title="Do Reflect"
        selectedBoard={board}
        setSelectedBoard={setBoard}
      />
      <Loading data={board} loading={loading} error={error}>
        <>
          {data?.team && board ? (
            <>
              <ConfigBoardModal teamId={teamId} setVisible={setIsCreateModalVisible} visible={isCreateModalVisible} />
              <ModalMeetingNote
                visible={isVisibleMeetingNote}
                setVisible={setIsVisibleMeetingNote}
                team={data?.team}
                iMember={iMember}
              />
              <ConfigBoardModal
                teamId={teamId}
                board={board}
                setVisible={setIsUpdateModalVisible}
                visible={isUpdateModalVisible}
              />
              <ConfigTimeTrackingModal
                team={data?.team}
                board={board}
                setVisible={setTimeTrackingModalVisible}
                visible={isTimeTrackingModalVisible}
              />
              <div>
                <div className="boardTools">
                  <div className="countDown">
                    {board.timerInProgress && board.endTime ? (
                      <CountDown startTime={moment().valueOf()} endTime={board?.endTime?.valueOf()} />
                    ) : (
                      '--:--:--'
                    )}
                  </div>
                  {board?.currentPhase === 'VOTES' && (
                    <div className="currentLimitVotes">Votes {`${currentNumVotes}/${board?.votesLimit}`}</div>
                  )}
                  <div className={`board-action ${isBoardPanelActive && 'active'}`}>
                    <div className="boardPanel" onClick={() => setIsBoardPanelActive(!isBoardPanelActive)}>
                      {isBoardPanelActive ? (
                        <CloseOutlined className="boardPanelIcon" />
                      ) : (
                        <MenuOutlined className="boardPanelIcon" />
                      )}
                      {'\t \t '} Action
                    </div>
                    <div className="boardActionPanel">
                      <ul>
                        {(iMember?.isOwner || iMember?.isSuperOwner) && (
                          <>
                            <li>
                              <PlusCircleOutlined className="boardPanelIcon " />
                              <a className="addBoard" onClick={() => setIsCreateModalVisible(true)}>
                                Create New Board
                              </a>
                            </li>
                            <li>
                              <EditOutlined className="boardPanelIcon " />
                              <a className="editBoard" onClick={() => setIsUpdateModalVisible(true)}>
                                Edit Board
                              </a>
                            </li>
                          </>
                        )}
                        {/* <li>
                        <PlusCircleOutlined className="boardPanelIcon " />
                        <a className="addBoard" onClick={() => setIsCreateModalVisible(true)}>
                          Start Timer
                        </a>
                      </li> */}
                        {/* <li>
                        <PlusCircleOutlined className="boardPanelIcon " />
                        <a className="addBoard" onClick={() => setIsCreateModalVisible(true)}>
                          Reset All Votes
                        </a>
                      </li> */}
                        {/* <li>
                        <StarOutlined className="boardPanelIcon " />
                        <a className="addBoard" onClick={() => setIsCreateModalVisible(true)}>
                          Show Bookmarks
                        </a>
                      </li> */}
                        <li>
                          <SnippetsOutlined className="boardPanelIcon " />
                          <a className="addBoard" onClick={() => setIsVisibleMeetingNote(true)}>
                            Meeting Notes
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="board-header">
                  <div className="board-tracking">
                    <div onClick={() => history.push(`/manage-members/${teamId}`)} className="board-members">
                      <Avatar.Group
                        maxCount={3}
                        style={{
                          cursor: 'pointer',
                        }}
                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                      >
                        {data?.team?.members?.map((member) => (
                          // <div onClick={() => history.push(`/manage-members/${teamId}`)} key={member?.user?.email}>
                          <>
                            <Tooltip title={member?.user?.nickname} key={member?.user?.email} placement="bottom">
                              {member.isOwner || member.isSuperOwner ? (
                                <Badge offset={[-15, -3]} count={<CrownFilled style={{ color: '#F79C2D' }} />}>
                                  <Avatar
                                    style={{ marginRight: '1px' }}
                                    size="default"
                                    shape="circle"
                                    key={member?.user?.email}
                                    src={<img src={member?.user?.picture} referrerPolicy="no-referrer" />}
                                  />
                                </Badge>
                              ) : (
                                <Avatar
                                  style={{ marginRight: '1px' }}
                                  size="default"
                                  shape="circle"
                                  key={member?.user?.email}
                                  src={<img src={member?.user?.picture} referrerPolicy="no-referrer" />}
                                />
                              )}
                            </Tooltip>
                          </>
                          // </div>
                        ))}
                      </Avatar.Group>
                    </div>
                    {board.isAnonymous && (
                      <div>
                        <ExclamationCircleOutlined /> You are giving feedback anonymously
                      </div>
                    )}
                    {!board.isLocked ? (
                      board.type === 'PHASE' && (
                        <div className="phase-header">
                          <div className="board-phase">
                            <div
                              className={`phase-step ${board?.currentPhase === 'REFLECT' && 'active'}`}
                              style={{
                                cursor: iMember?.isOwner || iMember?.isSuperOwner ? 'pointer' : 'not-allowed',
                              }}
                              onClick={() => {
                                if (iMember?.isOwner || iMember?.isSuperOwner)
                                  updateBoard({
                                    variables: {
                                      teamId,
                                      boardId,
                                      currentPhase: 'REFLECT',
                                      timerInProgress: false,
                                    },
                                  });
                                else {
                                  notification.warning({
                                    message: 'Permission denied',
                                    description: 'Only Super Owner and Owners can change stage of Wreflect process.',
                                    placement: 'bottomRight',
                                  });
                                }
                              }}
                            >
                              <BulbOutlined />
                              Reflect
                            </div>
                            <div
                              className={`phase-step ${board?.currentPhase === 'GROUP' && 'active'}`}
                              style={{
                                cursor: iMember?.isOwner || iMember?.isSuperOwner ? 'pointer' : 'not-allowed',
                              }}
                              onClick={() => {
                                if (iMember?.isOwner || iMember?.isSuperOwner)
                                  updateBoard({
                                    variables: {
                                      teamId,
                                      boardId,
                                      currentPhase: 'GROUP',
                                      timerInProgress: false,
                                    },
                                  });
                                else {
                                  notification.warning({
                                    message: 'Permission denied',
                                    description: 'Only Super Owner and Owners can change stage of Wreflect process.',
                                    placement: 'bottomRight',
                                  });
                                }
                              }}
                            >
                              <UngroupOutlined />
                              Group
                            </div>
                            <div
                              className={`phase-step ${board?.currentPhase === 'VOTES' && 'active'}`}
                              style={{
                                cursor: iMember?.isOwner || iMember?.isSuperOwner ? 'pointer' : 'not-allowed',
                              }}
                              onClick={() => {
                                if (iMember?.isOwner || iMember?.isSuperOwner)
                                  updateBoard({
                                    variables: {
                                      teamId,
                                      boardId,
                                      currentPhase: 'VOTES',
                                      timerInProgress: false,
                                    },
                                  });
                                else {
                                  notification.warning({
                                    message: 'Permission denied',
                                    description: 'Only Super Owner and Owners can change stage of Wreflect process.',
                                    placement: 'bottomRight',
                                  });
                                }
                              }}
                            >
                              <LikeOutlined />
                              Votes
                            </div>
                            <div
                              className={`phase-step ${board?.currentPhase === 'DISCUSS' && 'active'}`}
                              style={{
                                cursor: iMember?.isOwner || iMember?.isSuperOwner ? 'pointer' : 'not-allowed',
                              }}
                              onClick={() => {
                                if (iMember?.isOwner || iMember?.isSuperOwner)
                                  updateBoard({
                                    variables: {
                                      teamId,
                                      boardId,
                                      currentPhase: 'DISCUSS',
                                      timerInProgress: false,
                                    },
                                  });
                                else {
                                  notification.warning({
                                    message: 'Permission denied',
                                    description: 'Only Admin can change stage of Wreflect process.',
                                    placement: 'bottomRight',
                                  });
                                }
                              }}
                            >
                              <MessageOutlined />
                              Discuss
                            </div>
                          </div>
                          {(iMember?.isOwner || iMember?.isSuperOwner) && (
                            <>
                              {board.currentPhase === 'DISCUSS' ? (
                                <div
                                  style={{ margin: '0px 2px 0px 2px' }}
                                  className="phase-action-btn"
                                  onClick={() => {
                                    if (iMember?.isOwner || iMember?.isSuperOwner)
                                      updateBoard({
                                        variables: {
                                          teamId,
                                          boardId,
                                          isLocked: true,
                                        },
                                      });
                                    else {
                                      notification.warning({
                                        message: 'Permission denied',
                                        description: 'Only Admin can change stage of Wreflect process.',
                                        placement: 'bottomRight',
                                      });
                                    }
                                  }}
                                >
                                  <>
                                    <LockOutlined />
                                    End Reflect
                                  </>
                                </div>
                              ) : (
                                <div
                                  style={{ margin: '0px 2px 0px 2px' }}
                                  className="phase-action-btn"
                                  onClick={() => {
                                    if (iMember?.isOwner || iMember?.isSuperOwner)
                                      updateBoard({
                                        variables: {
                                          teamId,
                                          boardId,
                                          currentPhase:
                                            board.currentPhase == 'REFLECT'
                                              ? 'GROUP'
                                              : board.currentPhase == 'GROUP'
                                              ? 'VOTES'
                                              : 'DISCUSS',
                                          timerInProgress: false,
                                        },
                                      });
                                  }}
                                >
                                  <ArrowRightOutlined />
                                  Next
                                </div>
                              )}
                            </>
                          )}
                          {(iMember?.isOwner || iMember?.isSuperOwner) && (
                            <>
                              {!board?.timerInProgress ? (
                                <div className="phase-action-btn" onClick={() => setTimeTrackingModalVisible(true)}>
                                  <>
                                    <FieldTimeOutlined />
                                    Start Time
                                  </>
                                </div>
                              ) : (
                                <div
                                  className="phase-action-btn"
                                  onClick={() => {
                                    updateBoard({
                                      variables: {
                                        teamId,
                                        boardId,
                                        timerInProgress: false,
                                      },
                                    });
                                  }}
                                >
                                  <FieldTimeOutlined />
                                  Stop Time
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="lockedNoti">This board is locked for feedback by Admin</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="board flex flex-dir-r scrollable">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  {board?.columns?.map((column, index) => {
                    if (column.isActive) {
                      return (
                        <ColumnComponent
                          setIsUpdateModalVisible={setIsUpdateModalVisible}
                          iMember={iMember}
                          currentNumVotes={currentNumVotes}
                          setCurrentNumVotes={setCurrentNumVotes}
                          team={data?.team}
                          board={board}
                          index={index}
                          key={column.id}
                          column={column}
                        />
                      );
                    }
                  })}
                </DragDropContext>
              </div>
            </>
          ) : (
            <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
          )}
        </>
      </Loading>
    </>
  );
}
