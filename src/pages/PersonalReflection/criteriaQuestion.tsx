import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

import { QuestionCircleOutlined, MessageFilled, MessageOutlined } from '@ant-design/icons';
import { AnswerOnCriteria, Evaluation, Member } from '../../types';
import CommentModal from './commentModal';

type answerType = {
  assessmentOnCriteriaId: string;
  point: number;
  comment: string;
};

type Props = {
  isAllowEdit: boolean;
  member: Member;
  answer: AnswerOnCriteria;
  setAnswer: (value: AnswerOnCriteria) => void;
  // criteriaQuestion: Evaluation;
};

export default function CriteriaQuestion({ isAllowEdit, member, answer, setAnswer }: Props) {
  const [cursor, setCursor] = useState<'pointer' | 'not-allowed'>('not-allowed');
  const [point, setPoint] = useState<number>(answer?.point);
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState<string | null>(answer?.comment);

  useEffect(() => {
    setPoint(answer?.point);
    setComment(answer?.comment);
  }, [answer]);

  useEffect(() => {
    setCursor(isAllowEdit ? 'pointer' : 'not-allowed');
  }, [isAllowEdit]);

  useEffect(() => {
    setAnswer({ ...answer, point, comment });
  }, [point, comment]);

  const handleClickPoint = (value: number) => {
    if (isAllowEdit) {
      setPoint(value);
    }
  };

  return (
    <>
      <CommentModal
        isAllowEdit={isAllowEdit}
        member={member}
        answer={answer}
        isVisible={visible}
        setVisible={setVisible}
        comment={comment}
        setComment={setComment}
      />
      <div className="criteriaQuestion" style={!isAllowEdit ? { background: '#f2f1f1' } : {}}>
        <div className="criteriaHeader">
          {answer?.criteria?.name}
          <Tooltip trigger={['click']} placement="left" title={answer?.criteria?.description}>
            <QuestionCircleOutlined style={{ fontSize: '20px' }} />
          </Tooltip>
        </div>
        <div className="criteriaBody">
          <div className="questionPoint">
            <div style={{ cursor }} className="num-wrapper poll-center-items">
              <span
                style={{ cursor }}
                onClick={() => handleClickPoint(1)}
                className={`num  orange ${point == 1 && 'is-selected'}`}
              >
                1
              </span>
              <span
                style={{ cursor }}
                onClick={() => handleClickPoint(2)}
                className={`num blue ${point == 2 && 'is-selected'}`}
              >
                2
              </span>
              <span
                style={{ cursor }}
                onClick={() => handleClickPoint(3)}
                className={`num purple ${point == 3 && 'is-selected'}`}
              >
                3
              </span>
              <span
                style={{ cursor }}
                onClick={() => handleClickPoint(4)}
                className={`num lpink ${point == 4 && 'is-selected'}`}
              >
                4
              </span>
              <span
                style={{ cursor }}
                onClick={() => handleClickPoint(5)}
                className={`num green ${point == 5 && 'is-selected'}`}
              >
                5
              </span>
            </div>
          </div>
          <div className="actions">
            <div className="commentAction">
              {answer?.comment ? (
                <MessageFilled onClick={() => setVisible(true)} style={{ fontSize: '20px', cursor: 'pointer' }} />
              ) : (
                <MessageOutlined onClick={() => setVisible(true)} style={{ fontSize: '20px', cursor: 'pointer' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
