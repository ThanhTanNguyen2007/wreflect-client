import React, { useRef } from 'react';
import { Modal, Avatar, Form, FormInstance, Upload, Input, DatePicker, Select, Button, notification } from 'antd';
import moment from 'moment';

import { TeamMutations } from '../../grapql-client/mutations';
import { TeamQueries } from '../../grapql-client/queries';
import { useMutation } from '@apollo/client';

import { UploadOutlined } from '@ant-design/icons';
import { Team } from '../../types';
import config from '../../config';

type Props = {
  teamData?: Team;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EditTeamDetailModal = ({ teamData, isVisible, setIsVisible }: Props) => {
  // const prev = useRef(teamData);
  const formRef = useRef<FormInstance>(null);

  const [updateTeam] = useMutation(TeamMutations.updateTeam, {
    refetchQueries: [TeamQueries.getTeam],
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
  });

  const handleFinish = () => {
    formRef.current?.validateFields().then(async (values: any) => {
      const startDate = values['range-picker'] && values['range-picker'][0] ? values['range-picker'][0] : moment();
      const endDate = values['range-picker'] && values['range-picker'][1] ? values['range-picker'][1] : moment();
      const name = values['name'];
      const description = values['description'];
      const isPublish = values['select'] === 'public' ? true : false;
      const picture = values['upload']?.file?.response;

      await updateTeam({
        variables: { id: teamData?.id, name, picture, startDate, endDate, description, isPublish },
      });
      setIsVisible(false);
    });
  };

  return (
    <Modal
      destroyOnClose
      centered
      title="Edit Details Team"
      visible={isVisible}
      okText="Update"
      onOk={() => {
        handleFinish();
      }}
      onCancel={() => setIsVisible(false)}
    >
      <Avatar shape="square" size={64} src={teamData?.picture} />
      <Form layout="vertical" ref={formRef}>
        <Form.Item name="upload" label="Avatar" initialValue={teamData?.picture}>
          <Upload
            action={`${config.SERVER_BASE_URL}/api/upload`}
            name="photo"
            multiple={false}
            withCredentials={true}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          hasFeedback
          name="name"
          label="Team Name"
          initialValue={teamData?.name}
          rules={[
            { required: true, message: 'Please input your team name' },
            { min: 5, message: 'Team name must be minimum 5 characters.' },
            { max: 25, message: 'Team name must be maximum 25 characters.' },
          ]}
        >
          <Input bordered placeholder="Input team name" type="text" name="name" defaultValue={teamData?.name} />
        </Form.Item>
        <Form.Item
          name="description"
          hasFeedback
          label="Description"
          initialValue={teamData?.description}
          rules={[
            { required: true, message: 'Please input your team description' },
            { min: 15, message: 'Team desciption must be minimum 15 characters.' },
            { max: 100, message: 'Team name must be maximum 100 characters.' },
          ]}
        >
          <TextArea bordered placeholder="Description of the team" rows={4} name="description" />
        </Form.Item>
        <Form.Item
          name="range-picker"
          label="RangePicker"
          // initialValue={[moment(+teamData?.startDate), moment(+teamData?.endDate)]}
          initialValue={[moment(teamData?.startDate), moment(teamData?.endDate)]}
        >
          <RangePicker defaultValue={[moment(teamData?.startDate), moment(teamData?.endDate)]} />
        </Form.Item>
        <Form.Item name="select" label="Select">
          <Select defaultValue={teamData?.isPublic ? 'public' : 'private'}>
            <Select.Option value="private">Private</Select.Option>
            <Select.Option value="public">Public</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTeamDetailModal;
