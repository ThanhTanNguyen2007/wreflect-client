import { Modal } from 'antd';
import React from 'react';
import { Board, Member, Team } from '../../../../types';
import OpinionComponent from '../opinion';

type Props = {
  iMember: Member;
  team: Team;
  board: Board;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
};

export default function BookmarkedModal({ iMember, team, board, isVisible, setIsVisible }: Props) {
  return (
    <Modal
      className={`headerModal-purple`}
      title={
        <div className="flex flex-dir-c headerModalText">
          <div className="owner-opinion"></div>
          <p>Bookmarking Opinion/Acion List</p>
        </div>
      }
      centered
      visible={isVisible}
      closable
      footer={null}
      onCancel={() => setIsVisible(false)}
    >
      <div className="bookmarkingList">
        {board?.columns?.map((column) => (
          <>
            {column?.opinions
              ?.filter((opinion) => opinion?.isBookmarked)
              .map((opinion, index) => (
                <>
                  <OpinionComponent
                    key={opinion?.id}
                    iMember={iMember}
                    team={team}
                    board={board}
                    column={column}
                    index={index}
                    opinion={opinion}
                  />
                </>
              ))}
          </>
        ))}
      </div>
    </Modal>
  );
}
