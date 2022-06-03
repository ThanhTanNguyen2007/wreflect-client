import { useMutation, useSubscription } from '@apollo/client';
import { Modal, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5-thanhtan-custom-build/build/ckeditor';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic/';
import { useTranslation } from 'react-i18next';

import { BoardMutations, MemberMutations } from '../../../grapql-client/mutations';
import { Board, Member, Team } from '../../../types';
import { updateMeetingNoteResult, updateMeetingNoteVars } from '../../../grapql-client/mutations/BoardMutations';
import { BoardSubscription } from '../../../grapql-client/subcriptions';
import {
  subOnUpdateMeetingNoteResult,
  subOnUpdateMeetingNoteVars,
} from '../../../grapql-client/subcriptions/BoardSubscription';

type Props = {
  iMember: Member;
  team: Team;
  board: Board;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ModalMeetingNote({ iMember, team, board, visible, setVisible }: Props) {
  const [text, setText] = useState<any>(board?.meetingNote);
  const { t } = useTranslation();

  const [updateMeetingNote] = useMutation<updateMeetingNoteResult, updateMeetingNoteVars>(
    BoardMutations.updateMeetingNote,
    {
      onCompleted: () => {
        // notification.success({
        //   message: 'Updated Meeting Note',
        //   placement: 'bottomRight',
        // });
      },
      onError: () => {
        notification.error({
          message: "Can't Update Meeting Note",
          placement: 'bottomRight',
        });
      },
    },
  );

  const handleOnTextAreaChange = (value: string) => {
    setText(value);
  };

  useEffect(() => {
    setText(board?.meetingNote);
  }, [board]);

  return (
    <>
      <Modal
        visible={visible}
        destroyOnClose
        centered
        width={800}
        footer={[null, null]}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <h3>{t(`txt_meeting_notes`)}</h3>
        <p>{t(`txt_meeting_notes_desc`)}</p>
        <CKEditor
          editor={ClassicEditor}
          data={text}
          config={{
            outerHeight: '10px',
          }}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            editor.editing.view.change((writer) => {
              writer.setStyle('height', '500px', editor.editing.view.document.getRoot());
            });
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            handleOnTextAreaChange(editor.getData());
          }}
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
            updateMeetingNote({
              variables: {
                teamId: team?.id,
                boardId: board?.id,
                meetingNote: text,
              },
            });
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      </Modal>
    </>
  );
}
