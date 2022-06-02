import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  MenuOutlined,
  EditFilled,
  MessageFilled,
  CarryOutFilled,
  ExclamationCircleOutlined,
  DeleteFilled,
} from '@ant-design/icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Board, Column, Member, Team } from '../../../types';
import CreateTicket from './createTicket';
import OpinionComponent from './opinion';
import { Dropdown, Menu, Modal, notification } from 'antd';
import { useMutation } from '@apollo/client';
import { ColumnMutations } from '../../../grapql-client/mutations';
import { onError } from '@apollo/client/link/error';

type Props = {
  index: number;
  iMember: Member;
  column: Column;
  team: Team;
  board: Board;
  currentNumVotes: number | undefined;
  setCurrentNumVotes: (votes: number) => void;
  setIsUpdateModalVisible: (isVisible: boolean) => void;
};

const { confirm } = Modal;

export default function ColumnComponent({
  column,
  iMember,
  board,
  team,
  index,
  currentNumVotes,
  setCurrentNumVotes,
  setIsUpdateModalVisible,
}: Props) {
  const { t } = useTranslation();
  const [convertOpinions] = useMutation<ColumnMutations.convertColumnResult, ColumnMutations.convertColumnVars>(
    ColumnMutations.convertColumn,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const [emptyColumn] = useMutation<ColumnMutations.emptyColumnResult, ColumnMutations.emptyColumnVars>(
    ColumnMutations.emptyColumn,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const menu = (
    <Menu key={column.id}>
      <Menu.Item onClick={() => setIsUpdateModalVisible(true)} key="1" icon={<EditFilled />}>
        {t(`txt_boards_option_edit`)}
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          convertOpinions({
            variables: {
              teamId: board.teamId,
              boardId: board.id,
              columnId: column.id,
              action: 'OPINIONS',
            },
          })
        }
        icon={<MessageFilled />}
      >
        {t(`txt_boards_option_convert_opinion`)}
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() =>
          convertOpinions({
            variables: {
              teamId: board.teamId,
              boardId: board.id,
              columnId: column.id,
              action: 'ACTIONS',
            },
          })
        }
        icon={<CarryOutFilled />}
      >
        {t(`txt_boards_option_convert_action`)}
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          confirm({
            title: 'Do you want to delete these items?',
            centered: true,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
              await emptyColumn({
                variables: {
                  teamId: board.teamId,
                  boardId: board.id,
                  columnId: column.id,
                },
              });
            },
          });
        }}
        key="4"
        icon={<DeleteFilled />}
      >
        {t(`txt_boards_option_empty`)}
      </Menu.Item>
    </Menu>
  );

  return (
    <Droppable
      isCombineEnabled={board.currentPhase === 'GROUP'}
      isDropDisabled={board.isLocked}
      key={column.id}
      droppableId={column.id}
    >
      {(provided) => (
        <div className="column flex" {...provided.droppableProps} ref={provided.innerRef}>
          <div className="colHead">
            <div className="titleHead">{column?.title}</div>

            {(iMember?.isOwner || iMember?.isSuperOwner) && (
              <div className="actionHead">
                <Dropdown key={column.id} overlayStyle={{ width: '180px' }} overlay={menu} placement="bottomRight">
                  <MenuOutlined style={{ cursor: 'pointer' }} />
                </Dropdown>
              </div>
            )}
          </div>
          <div className="colContent">
            {column?.opinions?.length > 3 &&
              !board?.isLocked &&
              (board?.currentPhase == 'REFLECT' || board?.currentPhase == 'DISCUSS') && (
                <CreateTicket isCreateBottom={false} board={board} column={column} index={index} />
              )}
            {column?.opinions.map((opinion, index) => (
              <div key={opinion?.id}>
                <Draggable
                  isDragDisabled={board.isLocked || board.currentPhase === 'VOTES'}
                  draggableId={opinion.id}
                  index={index}
                  key={opinion.id}
                >
                  {(provided) => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                      <OpinionComponent
                        iMember={iMember}
                        currentNumVotes={currentNumVotes}
                        setCurrentNumVotes={setCurrentNumVotes}
                        team={team}
                        board={board}
                        column={column}
                        index={index}
                        opinion={opinion}
                      />
                    </div>
                  )}
                </Draggable>
              </div>
            ))}
            {provided.placeholder}

            {!board?.isLocked && (board?.currentPhase == 'REFLECT' || board?.currentPhase == 'DISCUSS') && (
              <CreateTicket isCreateBottom={true} board={board} column={column} index={index} />
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}
