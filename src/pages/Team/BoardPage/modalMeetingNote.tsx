import { useMutation } from '@apollo/client';
import { Modal, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import { MemberMutations } from '../../../grapql-client/mutations';
import { Member, Team } from '../../../types';

type Props = {
  iMember: Member;
  team: Team;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ModalMeetingNote({ iMember, team, visible, setVisible }: Props) {
  const [text, setText] = useState(iMember?.meetingNote);

  const [updateMeetingNote] = useMutation<
    MemberMutations.updateMeetingNoteResult,
    MemberMutations.updateMeetingNoteVars
  >(MemberMutations.updateMeetingNote, {
    onCompleted: () => {
      notification.success({
        message: 'Updated Meeting Note',
        placement: 'bottomRight',
      });
    },
    onError: () => {
      notification.error({
        message: "Can't Update Meeting Note",
        placement: 'bottomRight',
      });
    },
  });

  const handleOnTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value != '') {
      setText(e.currentTarget.value);
    }
  };

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
          updateMeetingNote({
            variables: {
              teamId: team.id,
              meetingNote: text,
            },
          });
        }}
      >
        <h3>Meeting Note</h3>
        <p>Here you can write your personal meeting notes. They are only visible to you.</p>
        <TextArea
          style={{ height: '300px' }}
          value={text}
          placeholder="Write your personal notes here"
          onChange={handleOnTextAreaChange}
        />
      </Modal>
    </>
  );
}
