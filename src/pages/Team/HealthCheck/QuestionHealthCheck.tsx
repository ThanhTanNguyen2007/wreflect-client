import React, { useEffect, useState } from 'react';
import { Badge, Card, Input } from 'antd';
import { MemberAnswer, MemberComment, MemberOnHealthCheckOnQuestion, TemplateQuestion } from '../../../types';
import { MessageOutlined } from '@ant-design/icons';
import Comment from './comment';
import { answerType } from './HealthCheck';

type Props = {
  answer?: MemberOnHealthCheckOnQuestion;
  question: TemplateQuestion;
  comments?: MemberOnHealthCheckOnQuestion[];
  handleUpdateAnswer: (value: answerType) => void;
};

export default function QuestionHealthCheck({ answer, comments, question, handleUpdateAnswer }: Props) {
  const [point, setPoint] = useState<number>(answer?.point);
  const [commentText, setCommentText] = useState('');
  const [isOpenComment, setIsOpenComment] = useState(false);

  useEffect(() => {
    handleUpdateAnswer({
      questionId: question?.id,
      point,
      comment: commentText,
    });
  }, [point, commentText]);

  const handleTextChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(value?.currentTarget?.value);
  };

  const handleClick = (value: number) => {
    if (answer) {
      return;
    }
    setPoint(value);
  };

  return (
    <Card
      hoverable
      bodyStyle={{ display: 'flex', flex: '1', flexDirection: 'column', justifyContent: 'space-between' }}
      className="templates-overview-card"
    >
      <div className="flex flex-1 flex-dir-c flex-ai-c flex-jc-sb poll-center-items">
        <h3>{question?.title}</h3>
        <p style={{ textAlign: 'center' }}>{question?.description}</p>
        <div style={answer && { cursor: 'default' }} className="num-wrapper poll-center-items">
          <span
            style={answer && { cursor: 'default' }}
            onClick={() => handleClick(1)}
            className={`num  orange ${point === 1 && 'is-selected'}`}
          >
            1
          </span>
          <span
            style={answer && { cursor: 'default' }}
            onClick={() => handleClick(2)}
            className={`num blue ${point === 2 && 'is-selected'}`}
          >
            2
          </span>
          <span
            style={answer && { cursor: 'default' }}
            onClick={() => handleClick(3)}
            className={`num purple ${point === 3 && 'is-selected'}`}
          >
            3
          </span>
          <span
            style={answer && { cursor: 'default' }}
            onClick={() => handleClick(4)}
            className={`num lpink ${point === 4 && 'is-selected'}`}
          >
            4
          </span>
          <span
            style={answer && { cursor: 'default' }}
            onClick={() => handleClick(5)}
            className={`num green ${point === 5 && 'is-selected'}`}
          >
            5
          </span>
        </div>
        {answer ? (
          <>
            <div>You choose {point}</div>
            <div style={{ marginTop: '20px' }} className="comments">
              <Badge size="small" count={comments.length} showZero={false}>
                <MessageOutlined
                  onClick={() => setIsOpenComment(true)}
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                />
              </Badge>
            </div>
            <Comment
              question={question}
              setIsOpenComment={setIsOpenComment}
              isOpenComment={isOpenComment}
              comments={comments}
            />
          </>
        ) : (
          <Input onChange={handleTextChange} placeholder="Add a Comment (Optional)" />
        )}
      </div>
    </Card>
  );
}
