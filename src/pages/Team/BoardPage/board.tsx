import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Tooltip, Empty, Badge, Spin, notification, Modal, Tabs, Row, Button } from 'antd';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useMutation, useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../../grapql-client/queries';
import ColumnComponent from './column';
import { BoardMutations, ColumnMutations, OpinionMutations } from '../../../grapql-client/mutations';
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
  QuestionCircleOutlined,
  TrademarkCircleOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import selfContext from '../../../contexts/selfContext';
import { ConfigBoardModal } from './CreateBoard';
import { Loading } from '../../../components/Loading';
import { TopNavBar } from '../../../components/TopNavBar';
import ConfigTimeTrackingModal from './configTimeTrackingModal';
import { CountDown } from '../../../components/CountDown';
import { Board } from '../../../types';
import ModalMeetingNote from './modalMeetingNote';
import { isMemberName } from 'typescript';
import moment from 'moment';
import BookmarkedModal from './BookmarkedModal/BookmarkedModal';

type Props = {
  teamId: string;
  boardId: string;
};
const { confirm } = Modal;

export default function BoardComponent({ teamId, boardId }: Props) {
  const [board, setBoard] = useState<Board | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isBoardPanelActive, setIsBoardPanelActive] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isTimeTrackingModalVisible, setTimeTrackingModalVisible] = useState(false);
  const [isBookmarkedVisible, setIsBookmarkedVisible] = useState(false);
  const history = useHistory();
  const client = useApolloClient();
  const me = useContext(selfContext);
  const [currentNumVotes, setCurrentNumVotes] = useState(0);
  const { t } = useTranslation();

  const { TabPane } = Tabs;

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

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
      confirm({
        title: 'Are you sure want to merge these opinion/action?',
        icon: <ExclamationCircleOutlined />,
        content: "If these opinion/action combined you can't split it, be careful to do that",
        centered: true,
        okText: 'Combine',
        onOk: async () => {
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

          await combineOpinion({
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
      {data?.team?.id && (
        <TopNavBar
          iMember={iMember}
          team={data?.team}
          boardId={boardId}
          title="Do Reflect"
          selectedBoard={board}
          setSelectedBoard={setBoard}
        />
      )}
      <div className="mt-25 flex flex-1 scrollable">
        <Loading data={board} loading={loading} error={error}>
          <>
            {data?.team && board ? (
              <>
                <ConfigBoardModal teamId={teamId} setVisible={setIsCreateModalVisible} visible={isCreateModalVisible} />
                <ModalMeetingNote
                  visible={isVisibleMeetingNote}
                  setVisible={setIsVisibleMeetingNote}
                  team={data?.team}
                  board={board}
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
                <BookmarkedModal
                  iMember={iMember}
                  team={data?.team}
                  board={board}
                  isVisible={isBookmarkedVisible}
                  setIsVisible={setIsBookmarkedVisible}
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
                    <div className="board-action" style={{ right: 620, position: 'relative' }}>
                      <Modal
                        className="modal-userguide"
                        maskStyle={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={<div className="flex flex-ai-c flex-jc-c">{t(`txt_boards_turtorial`)}</div>}
                        centered
                        visible={showModal}
                        onCancel={handleCancel}
                      >
                        <Row>
                          <Tabs centered tabPosition="top" defaultActiveKey="1">
                            <TabPane tab={`${t(`txt_boards_intro`)}`} key="1">
                              <p>{`${t(`txt_boards_intro_text`)}`}</p>
                              <p>{`${t(`txt_boards_intro_text2`)}`}</p>
                              <p>{`${t(`txt_boards_intro_text3`)}`}</p>
                              <p>{`${t(`txt_boards_intro_text4`)}`}</p>
                            </TabPane>
                            <TabPane tab={`${t(`txt_boards_collect`)}`} key="2">
                              <p>{`${t(`txt_boards_collect_text`)}`}</p>
                              <p>{`${t(`txt_boards_collect_text1`)}`}</p>
                              <p>{`${t(`txt_boards_collect_text2`)}`}</p>
                              <p>{`${t(`txt_boards_collect_text3`)}`}</p>
                              <p>{`${t(`txt_boards_collect_text4`)}`}</p>
                              <p>{`${t(`txt_boards_collect_text5`)}`}</p>
                              <p>{`${t(`txt_boards_collect_text3`)}`}</p>
                            </TabPane>
                            <TabPane tab={`${t(`txt_boards_group`)}`} key="3">
                              <p>{`${t(`txt_boards_group_text`)}`}</p>
                              <p>{`${t(`txt_boards_group_text2`)}`}</p>
                              <p>{`${t(`txt_boards_group_text3`)}`}</p>
                            </TabPane>
                            <TabPane tab={`${t(`txt_boards_votes`)}`} key="4">
                              <p>{`${t(`txt_boards_votes_text`)}`}</p>
                              <p>{`${t(`txt_boards_votes_text2`)}`}</p>
                            </TabPane>
                            <TabPane tab={`${t(`txt_boards_discuss`)}`} key="5">
                              <p>{`${t(`txt_boards_discuss_text`)}`}</p>
                              <p>{`${t(`txt_boards_discuss_text1`)}`}</p>
                              <p>{`${t(`txt_boards_discuss_text2`)}`}</p>
                            </TabPane>
                          </Tabs>
                        </Row>
                      </Modal>
                    </div>
                    <div className={`board-action ${isBoardPanelActive && 'active'}`}>
                      <div className="boardPanel" onClick={() => setIsBoardPanelActive(!isBoardPanelActive)}>
                        {isBoardPanelActive ? (
                          <CloseOutlined className="boardPanelIcon" />
                        ) : (
                          <MenuOutlined className="boardPanelIcon" />
                        )}
                        {'\t \t '} {t(`txt_boards_action`)}
                      </div>
                      <div className="boardActionPanel">
                        <ul>
                          {(iMember?.isOwner || iMember?.isSuperOwner) && (
                            <>
                              <li>
                                <PlusCircleOutlined className="boardPanelIcon " />
                                <a className="addBoard" onClick={() => setIsCreateModalVisible(true)}>
                                  {t(`txt_boards_create_boards`)}
                                </a>
                              </li>
                              <li>
                                <EditOutlined className="boardPanelIcon " />
                                <a className="editBoard" onClick={() => setIsUpdateModalVisible(true)}>
                                  {t(`txt_boards_edit_board`)}
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
                          <li>
                            <TrademarkCircleOutlined className="boardPanelIcon " />
                            <a className="addBoard" onClick={() => setIsCreateModalVisible(true)}>
                              {t(`txt_boards_reset_all_votes`)}
                            </a>
                          </li>
                          <li>
                            <StarOutlined className="boardPanelIcon " />
                            <a className="addBoard" onClick={() => setIsBookmarkedVisible(true)}>
                              {t(`txt_boards_show_bookmarks`)}
                            </a>
                          </li>
                          <li>
                            <SnippetsOutlined className="boardPanelIcon " />
                            <a className="addBoard" onClick={() => setIsVisibleMeetingNote(true)}>
                              {t(`txt_boards_meeting_notes`)}
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
                            {/* <Button  size type="text" icon={<QuestionCircleOutlined onClick={handleShowModal} />} /> */}
                            <QuestionCircleOutlined style={{ fontSize: '25px' }} onClick={handleShowModal} />
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
                                {t(`txt_boards_collect`)}
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
                                {t(`txt_boards_group`)}
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
                                {t(`txt_boards_votes`)}
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
                                {t(`txt_boards_discuss`)}
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
                                      {t(`txt_boards_end_reflect`)}
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
                                    {t(`txt_boards_next`)}
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
                                      {t(`txt_boards_start_time`)}
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
                                    {t(`txt_boards_stop_time`)}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )
                      ) : (
                        <div className="lockedNoti">{t(`txt_boards_notification_admin`)}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="board flex flex-dir-r ">
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
      </div>
    </>
  );
}
