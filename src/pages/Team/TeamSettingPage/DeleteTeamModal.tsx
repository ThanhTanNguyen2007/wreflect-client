import { useMutation } from '@apollo/client';
import { Form, Input, Modal, notification } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { TeamMutations } from '../../../grapql-client/mutations';
import { deleteTeam, deleteTeamResult, deleteTeamVars } from '../../../grapql-client/mutations/TeamMutations';
import { Team } from '../../../types';

type Props = {
  team: Team;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export default function DeleteTeamModal({ team, isVisible, setIsVisible }: Props) {
  const [form] = Form?.useForm();
  const { t } = useTranslation();
  const history = useHistory();

  const [deleteTeam, { loading: isDeleting }] = useMutation<deleteTeamResult, deleteTeamVars>(
    TeamMutations?.deleteTeam,
    {
      onCompleted: () => {
        notification?.success({
          message: t(`noti_delete_success`),
          placement: 'bottomRight',
        });
        history?.replace('/teams');
      },
      onError: (error) => {
        notification?.error({
          message: error?.message || 'Deleting Team was failed',
          placement: 'bottomRight',
        });
      },
    },
  );

  const onHandleDelete = async () => {
    form?.validateFields().then(async (values) => {
      const name = values['name'];
      if (name?.trim() !== team?.name?.trim()) {
        return notification?.error({
          message: 'Input not match with name of Team',
          placement: 'bottomRight',
        });
      }
      deleteTeam({
        variables: {
          teamId: team?.id,
        },
      });
    });
  };

  return (
    <Modal
      title={<h3 className="bold">Delete Template</h3>}
      centered
      visible={isVisible}
      destroyOnClose
      maskClosable
      confirmLoading={isDeleting}
      okText="Delete"
      onOk={onHandleDelete}
      onCancel={() => setIsVisible(false)}
    >
      <Form initialValues={{ name: '' }} preserve={false} form={form}>
        <div>{`Please type "${team?.name}" to confirm delete`}</div>
        <Form.Item
          rules={[{ required: true, message: 'Please type the name of team for confirm deleting' }]}
          name={'name'}
        >
          <Input type={'text'} onPaste={() => false} onDrop={() => false} autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
