import { Modal } from 'antd';
import React, { useRef } from 'react';
import { MemberComment, MemberOnHealthCheckOnQuestion, TemplateQuestion } from '../../../types';
import QuestionHealthCheck from './QuestionHealthCheck';

type Props = {
  isOpenComment: boolean;
  setIsOpenComment: (isVisible: boolean) => void;
  comments: MemberOnHealthCheckOnQuestion[];
  question: TemplateQuestion;
};

export default function Comment({ question, isOpenComment, setIsOpenComment, comments }: Props) {
  const remarkListRef = useRef<HTMLDivElement>(null);

  if (isOpenComment) console.log('comment are', comments);

  return (
    <Modal
      className={`headerModal-${question.color}`}
      title={
        <div className="headerModalText">
          <div className="flex flex-dir-col flex-ai-c flex-jc-c">
            <h3>{question.title}</h3>
            <p className="flex flex-jc-c flex-ai-c">{question?.description}</p>
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
        {comments?.map((comment) => (
          <>
            <div key={comment?.id} className="remark">
              <div className="remarkHeader">
                <p>{comment?.member?.user?.email}</p>
              </div>
              <div className="remarkContent">{comment?.comment}</div>
            </div>
          </>
        ))}
      </div>
    </Modal>
  );
}
