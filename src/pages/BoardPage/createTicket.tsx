import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import { Input, notification } from 'antd';
import { useMutation } from '@apollo/client';
import { OpinionMutations } from '../../grapql-client/mutations';
import { Board, Column } from '../../types';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

type Props = {
  index: number;
  board: Board;
  column: Column;
  isCreateBottom: boolean;
};

export default function createTicket({ board, column, isCreateBottom }: Props) {
  const [text, setText] = useState('');
  const [isAction, setIsAction] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [createOpinion, { loading }] = useMutation<
    OpinionMutations.createOpinionResult,
    OpinionMutations.createOpinionVars
  >(OpinionMutations.createOpinion);

  const handleCreateTicket = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (text.trim() && text.trim() != '' && text.length > 0) {
      createOpinion({
        variables: {
          teamId: board.teamId,
          boardId: board.id,
          columnId: column.id,
          text,
          isAction,
          isCreateBottom,
        },
        onError: (error) => {
          notification.error({
            placement: 'bottomRight',
            message: 'Cant create a ticket',
          });
        },
      });
      setText('');
    }
  };
  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  const onEmojiClick = (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
    setText(`${text}${data.emoji}`);
  };

  return (
    <>
      <div style={{ position: 'relative' }} className="panel tab">
        <section
          style={{
            position: 'absolute',
            bottom: '120px',
            zIndex: '50',
          }}
        >
          {isIconOpen && <Picker pickerStyle={{ width: '250px', height: '250px' }} onEmojiClick={onEmojiClick} />}
        </section>
        <a className={!isAction ? 'active link' : 'link'} onClick={() => setIsAction(false)}>
          Opinion
        </a>
        <a className={isAction ? 'active link' : 'link'} onClick={() => setIsAction(true)}>
          Action
        </a>
        <div
          style={{ display: 'block', float: 'right', marginLeft: 'auto', cursor: 'pointer' }}
          onClick={() => setIsIconOpen(!isIconOpen)}
        >
          {isIconOpen ? <CloseCircleOutlined /> : <SmileOutlined />}
        </div>
        {/* <Picker onEmojiClick={onEmojiClick} /> */}
        <TextArea
          onChange={handleOnChange}
          onPressEnter={handleCreateTicket}
          value={text}
          placeholder={`Press enter to add ${isAction ? 'Action' : 'Opinion'}`}
          disabled={loading}
        />
      </div>
    </>
  );
}
