import { Modal, InputNumber, notification } from 'antd';
import React, { useState } from 'react';
import { Board, Team } from '../../types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { BoardMutations } from '../../grapql-client/mutations';
import moment from 'moment';

type Props = {
  team: Team;
  board: Board;
  visible: boolean;
  setVisible: (isVisible: boolean) => void;
};

export default function ConfigTimeTrackingModal({ team, board, visible, setVisible }: Props) {
  const [minutes, setMinutes] = useState(60);

  const [updateBoard] = useMutation<BoardMutations.updateBoardResult, BoardMutations.updateBoardVars>(
    BoardMutations.updateBoard,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
      // update: (cache, { data }) => {
      //   if (!data) return;
      //   cache.modify({
      //     id: cache.identify(data.updateBoard),
      //     fields: {
      //       timerInProgress: () => data.updateBoard.timerInProgress,
      //       endTime: () => data.updateBoard.endTime,
      //     },
      //   });
      //   setVisible(false);
      // },
      // optimisticResponse: {
      //   updateBoard: {
      //     ...boardData,
      //     timerInProgress: true,
      //     endTime: moment().add(minutes, 'minutes').toDate().getTime().toString(),
      //   },
      // },
    },
  );

  return (
    <Modal
      centered
      visible={visible}
      onOk={() => {
        updateBoard({
          variables: {
            teamId: team?.id,
            boardId: board?.id,
            timerInProgress: true,
            endTime: `${moment().add(minutes, 'minutes').valueOf()}`,
          },
          optimisticResponse: {
            updateBoard: {
              ...board,
              timerInProgress: true,
              endTime: `${moment().add(minutes, 'minutes').valueOf()}`,
            },
          },
        });
        setVisible(false);
      }}
      title="Set duration for the current phase"
      onCancel={() => setVisible(false)}
    >
      <div className="duration-modal">
        <div className="time-duration">
          <div className="time-label">
            <div className="duration-label">Duration</div>
            <div className="unit-label">(In minutes)</div>
          </div>
          <InputNumber value={minutes} onChange={(value) => setMinutes(value)}></InputNumber>
        </div>
        <div className="time-tracking-notes">
          <InfoCircleOutlined />
          <span>{`The current phase will end after ${minutes} minutes.`}</span>
        </div>
      </div>
    </Modal>
  );
}
