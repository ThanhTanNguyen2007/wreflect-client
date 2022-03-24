import React, { useState, useContext } from 'react';

import { Dropdown, Spin, Menu, Modal, Input, Badge, Avatar, Tooltip, notification } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import {
  StarFilled,
  StarOutlined,
  DeleteFilled,
  EditFilled,
  EllipsisOutlined,
  FireFilled,
  UpCircleOutlined,
  DownCircleOutlined,
  ExclamationCircleOutlined,
  MessageFilled,
  MessageOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { Board, Column, Member, Opinion, Team } from '../../types';
import { useMutation, useApolloClient } from '@apollo/client';
import selfContext from '../../contexts/selfContext';
import { OpinionMutations } from '../../grapql-client/mutations';
import { BoardQueries } from '../../grapql-client/queries';
import Remark from './remark';
import ActionComponent from './action';

type Props = {
  iMember?: Member;
  team: Team;
  board: Board;
  column: Column;
  opinion: Opinion;
  index: number;
  currentNumVotes: number | undefined;
  setCurrentNumVotes: (votes: number) => void;
};

const { confirm } = Modal;
const { TextArea } = Input;

export default function OpinionComponent({
  iMember,
  opinion,
  team,
  board,
  column,
  index,
  currentNumVotes,
  setCurrentNumVotes,
}: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const client = useApolloClient();
  const me = useContext(selfContext);
  const [isOpenRemark, setIsOpenRemark] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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

  const [removeOpinion] = useMutation<OpinionMutations.removeOpinionResult, OpinionMutations.removeOpinionVars>(
    OpinionMutations.removeOpinion,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
    },
  );

  const menu = (
    <Menu>
      {/* {board.currentPhase === 'DISCUSS' && (
        <Menu.Item key="3" icon={<FireFilled />}>
          Convet to Action
        </Menu.Item>
      )} */}
      <Menu.Item onClick={() => setIsEdit(true)} key="2" icon={<EditFilled />}>
        Edit
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={() => {
          confirm({
            title: 'Do you want to delete these items?',
            centered: true,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
              const prevBoard = board;
              const newColumns = board.columns.map((column) => {
                return { ...column, opinions: column.opinions.filter((x) => x.id != opinion.id) };
              });

              client.cache.writeQuery({
                query: BoardQueries.getBoard,
                variables: {
                  boardId: board.id,
                },
                data: {
                  board: { ...board, columns: newColumns },
                },
              });
              await removeOpinion({
                variables: {
                  teamId: board.teamId,
                  boardId: board.id,
                  columnId: column.id,
                  opinionId: opinion.id,
                },
                onError: () => {
                  client.cache.writeQuery({
                    query: BoardQueries.getBoard,
                    variables: {
                      boardId: board.id,
                    },
                    data: {
                      board: prevBoard,
                    },
                  });
                },
              });
            },
          });
        }}
        icon={<DeleteFilled />}
      >
        Remove
      </Menu.Item>

      <Menu.Item>
        <div className="color-selector">
          <div
            className="blue block-color"
            onClick={() =>
              updateOpinion({
                variables: {
                  teamId: board.teamId,
                  opinionId: opinion.id,
                  color: 'blue',
                },
                optimisticResponse: {
                  updateOpinion: {
                    ...opinion,
                    color: 'blue',
                  },
                },
              })
            }
          />
          <div
            className="lblue block-color"
            onClick={() =>
              updateOpinion({
                variables: {
                  teamId: board.teamId,
                  opinionId: opinion.id,
                  color: 'lblue',
                },
                optimisticResponse: {
                  updateOpinion: {
                    ...opinion,
                    color: 'lblue',
                  },
                },
              })
            }
          />
          <div
            className="green block-color"
            onClick={() =>
              updateOpinion({
                variables: {
                  teamId: board.teamId,
                  opinionId: opinion.id,
                  color: 'green',
                },
                optimisticResponse: {
                  updateOpinion: {
                    ...opinion,
                    color: 'green',
                  },
                },
              })
            }
          />
          <div
            className="orange block-color"
            onClick={() =>
              updateOpinion({
                variables: {
                  teamId: board.teamId,
                  opinionId: opinion.id,
                  color: 'orange',
                },
                optimisticResponse: {
                  updateOpinion: {
                    ...opinion,
                    color: 'orange',
                  },
                },
              })
            }
          />
          <div
            className="lpink block-color"
            onClick={() =>
              updateOpinion({
                variables: {
                  teamId: board.teamId,
                  opinionId: opinion.id,
                  color: 'lpink',
                },
                optimisticResponse: {
                  updateOpinion: {
                    ...opinion,
                    color: 'lpink',
                  },
                },
              })
            }
          />
          <div
            className="pink block-color"
            onClick={() =>
              updateOpinion({
                variables: {
                  teamId: board.teamId,
                  opinionId: opinion.id,
                  color: 'pink',
                },
                optimisticResponse: {
                  updateOpinion: {
                    ...opinion,
                    color: 'pink',
                  },
                },
              })
            }
          />
          <div
            className="purple block-color"
            onClick={() =>
              updateOpinion({
                variables: {
                  teamId: board.teamId,
                  opinionId: opinion.id,
                  color: 'purple',
                },
                optimisticResponse: {
                  updateOpinion: {
                    ...opinion,
                    color: 'purple',
                  },
                },
              })
            }
          />
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Draggable
      isDragDisabled={board.isLocked || board.currentPhase === 'REFLECT'}
      draggableId={opinion.id}
      index={index}
      key={opinion.id}
    >
      {(provided) => (
        <div
          className={`opinionCol ${opinion.color}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="opinionHeader">
            {opinion.isBookmarked ? (
              <StarFilled
                onClick={() => {
                  // setCurrentOpinion({ ...currentOpinion, isBookmarked: false });
                  updateOpinion({
                    variables: {
                      teamId: board.teamId,
                      opinionId: opinion.id,
                      isBookmarked: false,
                    },
                    optimisticResponse: {
                      updateOpinion: {
                        ...opinion,
                        isBookmarked: false,
                      },
                    },
                  });
                }}
                style={{ fontSize: '20px', cursor: 'pointer' }}
              />
            ) : (
              <StarOutlined
                onClick={() => {
                  // setCurrentOpinion({ ...currentOpinion, isBookmarked: true });
                  updateOpinion({
                    variables: {
                      teamId: board.teamId,
                      opinionId: opinion.id,
                      isBookmarked: true,
                    },
                    optimisticResponse: {
                      updateOpinion: {
                        ...opinion,
                        isBookmarked: true,
                      },
                    },
                  });
                }}
                style={{ fontSize: '20px', cursor: 'pointer' }}
              />
            )}

            <div style={{ marginRight: 'auto', marginLeft: '10px' }} className="owner-opinion">
              {board.isAnonymous ? (
                <h4>Anonymous</h4>
              ) : (
                <Avatar.Group
                  maxCount={2}
                  style={{
                    cursor: 'pointer',
                  }}
                  maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                >
                  {team.members
                    ?.filter((member) => opinion.mergedAuthors.includes(member?.id) || opinion?.authorId == member?.id)
                    .map((member) => (
                      <Tooltip title={member?.user?.nickname} key={member?.user?.email} placement="bottom">
                        <Avatar
                          style={{ marginRight: '3px' }}
                          size="default"
                          key={member?.user?.email}
                          src={member?.user?.picture}
                        />
                      </Tooltip>
                    ))}
                </Avatar.Group>
              )}
            </div>
            <div>
              {(!board?.isLocked &&
                (opinion.authorId === iMember?.id || opinion?.mergedAuthors.includes(iMember?.id))) ||
              iMember?.isSuperOwner ||
              iMember?.isOwner ? (
                <Dropdown overlayStyle={{ width: '180px' }} overlay={menu} placement="bottomRight">
                  <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Dropdown>
              ) : (
                <div style={{ width: '20px' }}></div>
              )}
            </div>
          </div>

          <div className="opinionContent">
            <div className="opinionText">
              {isEdit ? (
                <TextArea
                  style={{ textAlign: 'center', minHeight: '180px' }}
                  autoFocus
                  bordered
                  onPressEnter={(e) => {
                    if (!e.shiftKey && e.currentTarget.value && e.currentTarget.value.length > 0) {
                      setIsEdit(false);
                      updateOpinion({
                        variables: {
                          teamId: board.teamId,
                          opinionId: opinion.id,
                          text: e.currentTarget.value.trim(),
                        },
                        optimisticResponse: {
                          updateOpinion: {
                            ...opinion,
                            text: e.currentTarget.value,
                          },
                        },
                      });
                    }
                  }}
                  defaultValue={opinion.text}
                />
              ) : (
                <p>
                  {opinion.text.split('\n').map((str) => {
                    return (
                      <>
                        {str}
                        <br />
                      </>
                    );
                  })}
                </p>
              )}
              {opinion.isAction === true && (
                <ActionComponent iMember={iMember} team={team} board={board} column={column} opinion={opinion} />
              )}
            </div>
          </div>

          <div className="opinionFooter">
            {board.currentPhase === 'VOTES' && (
              <>
                <div className="upvote">
                  <Badge size="small" count={opinion.upVote.length - opinion.downVote.length}>
                    <UpCircleOutlined
                      onClick={() => {
                        if (iMember?.id && (currentNumVotes as number) < board.votesLimit) {
                          if (opinion.downVote.includes(iMember.id)) {
                            let firstId = false;
                            updateOpinion({
                              variables: {
                                teamId: board?.teamId,
                                opinionId: opinion?.id,
                                downVote: opinion.downVote.filter((id) => {
                                  if (id === iMember.id && firstId == false) {
                                    firstId = true;
                                    return false;
                                  }
                                  return true;
                                }),
                              },
                              optimisticResponse: {
                                updateOpinion: {
                                  ...opinion,
                                  downVote: opinion.downVote.filter((id) => {
                                    if (id === iMember.id && firstId == false) {
                                      firstId = true;
                                      return false;
                                    }
                                    return true;
                                  }),
                                },
                              },
                            });
                            setCurrentNumVotes((currentNumVotes as number) - 1);
                          } else {
                            updateOpinion({
                              variables: {
                                teamId: board?.teamId,
                                opinionId: opinion?.id,
                                upVote: [...opinion?.upVote, iMember.id],
                              },
                              optimisticResponse: {
                                updateOpinion: {
                                  ...opinion,
                                  upVote: [...opinion?.upVote, iMember.id],
                                },
                              },
                            });
                            setCurrentNumVotes((currentNumVotes as number) + 1);
                          }
                        }
                      }}
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                    />
                  </Badge>
                </div>
                <div className="downvote">
                  <DownCircleOutlined
                    onClick={() => {
                      if (
                        iMember?.id &&
                        opinion?.upVote.length - opinion?.downVote?.length > 0 &&
                        (currentNumVotes as number) <= board.votesLimit
                      ) {
                        if (opinion.upVote.includes(iMember.id)) {
                          let firstId = false;
                          updateOpinion({
                            variables: {
                              teamId: board?.teamId,
                              opinionId: opinion?.id,
                              upVote: opinion.upVote.filter((id) => {
                                if (id === iMember?.id && firstId == false) {
                                  firstId = true;
                                  return false;
                                }
                                return true;
                              }),
                            },
                            optimisticResponse: {
                              updateOpinion: {
                                ...opinion,
                                upVote: opinion.upVote.filter((id) => {
                                  if (id === iMember?.id && firstId == false) {
                                    firstId = true;
                                    return false;
                                  }
                                  return true;
                                }),
                              },
                            },
                          });
                          setCurrentNumVotes((currentNumVotes as number) - 1);
                        } else {
                          updateOpinion({
                            variables: {
                              teamId: board?.teamId,
                              opinionId: opinion?.id,
                              downVote: [...opinion?.downVote, iMember.id],
                            },
                            optimisticResponse: {
                              updateOpinion: {
                                ...opinion,
                                downVote: [...opinion?.downVote, iMember.id],
                              },
                            },
                          });
                          setCurrentNumVotes((currentNumVotes as number) + 1);
                        }
                      }
                    }}
                    style={{ fontSize: '20px', marginLeft: '5px', cursor: 'pointer' }}
                  />
                </div>
                <div style={{ marginLeft: 'auto' }} className="myVotes">
                  [Your votes{' '}
                  {`${
                    opinion?.upVote.filter((voteIds) => voteIds == iMember?.id).length +
                    opinion.downVote.filter((votesId) => votesId === iMember?.id).length
                  }`}
                  ]
                </div>
              </>
            )}

            {board.currentPhase == 'DISCUSS' && (
              <div className="remarks">
                <Badge size="small" count={opinion.remarks.length} showZero={false}>
                  {opinion.remarks.length > 0 ? (
                    <MessageFilled
                      onClick={() => setIsOpenRemark(true)}
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                    />
                  ) : (
                    <MessageOutlined
                      onClick={() => setIsOpenRemark(true)}
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                    />
                  )}
                </Badge>
              </div>
            )}
          </div>
          <Remark
            iMember={iMember}
            team={team}
            board={board}
            column={column}
            isOpenRemark={isOpenRemark}
            setIsOpenRemark={setIsOpenRemark}
            opinion={opinion}
          />
        </div>
      )}
    </Draggable>
  );
}
