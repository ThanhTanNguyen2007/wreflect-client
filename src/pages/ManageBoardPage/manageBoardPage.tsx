import React, { useContext, useState } from 'react';
import { Button, Row, Col, Switch, Tooltip, Empty, Modal, notification } from 'antd';
import {
  PlusOutlined,
  LockTwoTone,
  UnlockTwoTone,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { useMutation, useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { TopNavBar } from '../../components/TopNavBar';
import { Loading } from '../../components/Loading';
import { BoardMutations } from '../../grapql-client/mutations';
import { ConfigBoardModal } from '../configBoardModal';
import selfContext from '../../contexts/selfContext';

type Props = {
  teamId: string;
};

const ManageBoardPage = ({ teamId }: Props) => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const me = useContext(selfContext);

  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  const [updateBoard, { loading: updatingBoard }] = useMutation<
    BoardMutations.updateBoardResult,
    BoardMutations.updateBoardVars
  >(BoardMutations.updateBoard, {
    onError: (error) => {
      notification.error({
        message: error?.message,
        placement: 'bottomRight',
      });
    },
  });

  const [deleteBoard] = useMutation<BoardMutations.updateBoardResult, BoardMutations.deleteBoardVars>(
    BoardMutations.deleteBoard,
    {
      onError: (error) => {
        notification.error({
          message: error.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const handleDeleteBoard = (teamId: string, boardId: string) => {
    Modal.confirm({
      title: 'Are you sure want to delete board',
      centered: true,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        deleteBoard({
          variables: {
            teamId,
            boardId,
          },
        });
      },
    });
  };

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  return (
    <>
      <ConfigBoardModal teamId={teamId} setVisible={setIsCreateModalVisible} visible={isCreateModalVisible} />
      <TopNavBar iMember={iMember} team={data?.team} title="Manage Board" />
      <Loading refetch={refetch} data={data?.team} loading={loading} error={error}>
        <>
          <div className="manage-board">
            <div className="board-selector">
              <div className="button-right">
                <Button onClick={() => setIsCreateModalVisible(true)} icon={<PlusOutlined />}>
                  Create Board
                </Button>
              </div>
            </div>

            <Row gutter={16}>
              <Col span={24}>
                {data?.team?.boards?.length >= 1 ? (
                  <div className="board-list">
                    {data?.team.boards?.map((board) => {
                      return (
                        <div key={board.id}>
                          <ConfigBoardModal
                            teamId={teamId}
                            board={board}
                            setVisible={setIsUpdateModalVisible}
                            visible={isUpdateModalVisible}
                          />
                          <div
                            className="board-items site-layout-background"
                            key={board.id}
                            style={{
                              padding: 24,
                              height: '80px',
                              width: '100%',
                            }}
                          >
                            <h1>{board.title}</h1>
                            <div className="board-icons">
                              <span className="text-button" style={{ marginRight: 20 }}>
                                <Switch
                                  style={{ marginRight: 10 }}
                                  checkedChildren={<LockTwoTone twoToneColor="white" />}
                                  unCheckedChildren={<UnlockTwoTone twoToneColor="white" />}
                                  checked={board.isLocked}
                                  loading={updatingBoard}
                                  onClick={() => {
                                    if (iMember?.isOwner || iMember?.isSuperOwner) {
                                      updateBoard({
                                        variables: {
                                          teamId,
                                          boardId: board?.id,
                                          isLocked: !board?.isLocked,
                                        },
                                      });
                                    }
                                  }}
                                />
                                Lock Board
                              </span>
                              {/* <Tooltip title="Clone Board">
                                <CopyOutlined style={{ marginRight: 20 }} />
                              </Tooltip> */}
                              <Tooltip title="Edit">
                                <EditOutlined
                                  onClick={() => setIsUpdateModalVisible(true)}
                                  style={{ marginRight: 20 }}
                                />
                              </Tooltip>
                              <Tooltip title="Delete">
                                <DeleteOutlined
                                  onClick={() => handleDeleteBoard(board.teamId, board.id)}
                                  style={{ marginRight: 20 }}
                                />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
                )}
              </Col>
            </Row>
          </div>
        </>
      </Loading>
    </>
  );
};

export default ManageBoardPage;
