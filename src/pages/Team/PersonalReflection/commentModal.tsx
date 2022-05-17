import { Modal, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { AnswerOnCriteria, Evaluation, Member } from '../../../types';

const { TextArea } = Input;

type Props = {
  isAllowEdit: boolean;
  answer: AnswerOnCriteria;
  member: Member;
  comment: string;
  setComment: (value: string) => void;
  isVisible: boolean;
  setVisible: (value: boolean) => void;
};

export default function CommentModal({ answer, isAllowEdit, isVisible, setVisible, comment, setComment }: Props) {
  const [value, setValue] = useState(comment);

  useEffect(() => {
    setValue(comment);
  }, [comment]);

  const handleSave = () => {
    setComment(value);
    setVisible(false);
  };

  return (
    <Modal
      className={`headerModal-purple`}
      destroyOnClose
      title={
        <div className="flex flex-ai-c flex-jc-c">
          {/* <h3 style={{ color: 'white' }}>{}</h3> */}
          <div className="bold" style={{ color: 'white' }}>
            {answer?.criteria?.name}
          </div>
        </div>
      }
      centered
      maskClosable={false}
      closable={false}
      footer={<Button onClick={() => handleSave()}>Done</Button>}
      onCancel={() => {
        setVisible(false);
      }}
      visible={isVisible}
    >
      <TextArea
        style={{ height: '200px' }}
        autoFocus
        disabled={!isAllowEdit}
        placeholder="Comment here..."
        value={value}
        onChange={(value) => setValue(value.currentTarget.value)}
      />
    </Modal>
  );
}
