import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import { Input, notification, Modal } from 'antd';
import { useMutation } from '@apollo/client';
import { OpinionMutations } from '../../../grapql-client/mutations';
import { Board, Column } from '../../../types';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import GenerateGif from './generateGif';

const { TextArea } = Input;

type Props = {
  index: number;
  board: Board;
  column: Column;
  isCreateBottom: boolean;
};

export default function CreateTicket({ board, column, isCreateBottom }: Props) {
  const [text, setText] = useState('');
  const [isAction, setIsAction] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [createOpinion, { loading }] = useMutation<
    OpinionMutations.createOpinionResult,
    OpinionMutations.createOpinionVars
  >(OpinionMutations.createOpinion, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
  });

  const handleCreateTicket = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!text.trim().replace('\n', '')) {
      e.preventDefault();
      return;
    }
    if (!e.shiftKey && text.trim() && text.trim() != '' && text.length > 0) {
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
          style={{ marginBottom: '5px' }}
          onChange={handleOnChange}
          onPressEnter={handleCreateTicket}
          value={text}
          placeholder={`Press enter to add ${isAction ? 'Action' : 'Opinion'}`}
          disabled={loading}
        />
        {/* <GenerateGif /> */}
        {isIconOpen && <Picker pickerStyle={{ width: '100%', height: '300px' }} onEmojiClick={onEmojiClick} />}
      </div>
    </>
  );
}
