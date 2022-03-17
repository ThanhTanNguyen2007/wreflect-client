import React, { useEffect, useState } from 'react';
import { Badge, Input } from 'antd';
import { MemberAnswer, MemberComment } from '../../types';
import { MessageOutlined } from '@ant-design/icons';
import Comment from './comment';

type Props = {
  statement: {
    id: string;
    title: string;
    color: string;
    description: string;
  };
  answerOfCurrentUser?: MemberAnswer;
  commentOfAllMembers?: MemberComment[];
  handleOnRateChange: (questionId: string, value: string) => void;
  handleOnCommentChange: (questionId: string, text: string) => void;
};

export default function Statement({
  statement,
  answerOfCurrentUser,
  commentOfAllMembers,
  handleOnRateChange,
  handleOnCommentChange,
}: Props) {
  const [mark, setIsMark] = useState<string | null>(
    answerOfCurrentUser
      ? answerOfCurrentUser?.answers?.find((answer) => answer?.questionId === statement?.id)?.value
      : null,
  );

  const [isOpenComment, setIsOpenComment] = useState(false);

  useEffect(() => {
    handleOnRateChange(statement.id, `${mark}`);
  }, [mark]);

  const handleTextChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    handleOnCommentChange(statement.id, value.currentTarget.value);
  };

  const handleClick = (value: string) => {
    if (answerOfCurrentUser) {
      return;
    }
    setIsMark(value);
  };

  return (
    <>
      <h3>{statement?.title}</h3>
      <p style={{ textAlign: 'center' }}>{statement?.description}</p>
      <div style={answerOfCurrentUser && { cursor: 'default' }} className="num-wrapper poll-center-items">
        <span
          style={answerOfCurrentUser && { cursor: 'default' }}
          onClick={() => handleClick('1')}
          className={`num  orange ${mark === '1' && 'is-selected'}`}
        >
          1
        </span>
        <span
          style={answerOfCurrentUser && { cursor: 'default' }}
          onClick={() => handleClick('2')}
          className={`num blue ${mark === '2' && 'is-selected'}`}
        >
          2
        </span>
        <span
          style={answerOfCurrentUser && { cursor: 'default' }}
          onClick={() => handleClick('3')}
          className={`num purple ${mark === '3' && 'is-selected'}`}
        >
          3
        </span>
        <span
          style={answerOfCurrentUser && { cursor: 'default' }}
          onClick={() => handleClick('4')}
          className={`num lpink ${mark === '4' && 'is-selected'}`}
        >
          4
        </span>
        <span
          style={answerOfCurrentUser && { cursor: 'default' }}
          onClick={() => handleClick('5')}
          className={`num green ${mark === '5' && 'is-selected'}`}
        >
          5
        </span>
      </div>
      {answerOfCurrentUser ? (
        <>
          <div>You choose {mark}</div>
          <div style={{ marginTop: '20px' }} className="comments">
            <Badge size="small" count={commentOfAllMembers.length} showZero={false}>
              <MessageOutlined onClick={() => setIsOpenComment(true)} style={{ fontSize: '20px', cursor: 'pointer' }} />
            </Badge>
          </div>
        </>
      ) : (
        <Input onChange={handleTextChange} placeholder="Add a Comment (Optional)" />
      )}
      <Comment
        statement={statement}
        setIsOpenComment={setIsOpenComment}
        isOpenComment={isOpenComment}
        commentOfAllMembers={commentOfAllMembers}
      />
    </>
  );
}
