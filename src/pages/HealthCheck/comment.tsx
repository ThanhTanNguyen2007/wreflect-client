import { Modal } from 'antd';
import React, { useRef } from 'react';
import { MemberComment } from '../../types';
import Statement from './Statement';

type Props = {
  isOpenComment: boolean;
  setIsOpenComment: (isVisible: boolean) => void;
  commentOfAllMembers: MemberComment[];
  statement: {
    id: string;
    title: string;
    color: string;
    bad: string;
    good: string;
  };
};

export default function Comment({ statement, isOpenComment, setIsOpenComment, commentOfAllMembers }: Props) {
  const remarkListRef = useRef<HTMLDivElement>(null);

  if (isOpenComment) console.log('comment are', commentOfAllMembers);

  return (
    <Modal
      className={`headerModal-${statement.color}`}
      title={
        <div className="headerModalText">
          <div className="flex flex-dir-col flex-ai-c flex-jc-c">
            <h3>{statement.title}</h3>
            <p className="flex flex-jc-c flex-ai-c">{statement.good}</p>
            <p className="flex flex-jc-c flex-ai-c">{statement.bad}</p>
          </div>
        </div>
      }
      centered
      visible={isOpenComment}
      closable
      footer={null}
      onCancel={() => setIsOpenComment(false)}
    >
      <div className="remarkline" ref={remarkListRef}>
        {commentOfAllMembers?.map((comment) => (
          <>
            <div key={comment?.id} className="remark">
              <div className="remarkHeader">
                <p>{comment?.member.user.email}</p>
              </div>
              <div className="remarkContent">{comment.text}</div>
            </div>
          </>
        ))}
      </div>
    </Modal>
  );
}
