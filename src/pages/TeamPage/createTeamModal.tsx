import React from 'react';
import moment from 'moment';
import { Modal, Form, Input, DatePicker, Upload, Button, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';

import { TeamMutations } from '../../grapql-client/mutations';
import { TeamQueries } from '../../grapql-client/queries';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import config from '../../config';
import { UploadFile } from 'antd/lib/upload/interface';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type Props = {
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
};

const CreateTeamModal = ({ isVisible, setIsVisible }: Props) => {
  const [form] = Form.useForm();

  const [addNewTeam] = useMutation(TeamMutations.createTeam, {
    // refetchQueries: [TeamQueries.getTeams, TeamQueries.getTeamIds],
    refetchQueries: [TeamQueries.getTeams],
  });

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = () => {
    form.validateFields().then(async (values: any) => {
      const startDate = values['range-picker'] && values['range-picker'][0] ? values['range-picker'][0] : moment();
      const endDate = values['range-picker'] && values['range-picker'][1] ? values['range-picker'][1] : moment();
      const teamName = values['teamName'];
      const teamDescription = values['teamDescription'];
      const isPublic = values['select'] === 'public' ? true : false;
      const picture = values['upload'][0]?.response || values['upload'];
      addNewTeam({
        variables: {
          startDate,
          endDate,
          name: teamName,
          description: teamDescription,
          picture: picture,
          isPublic: isPublic,
        },
      });
      form.resetFields();
      setIsVisible(false);
    });
  };

  const props = {
    // beforeUpload: async (file: RcFile) => {
    //   if (file.type !== 'image/png') {
    //     message.error(`${file.name} is not a png file`);
    //   }
    //   return file.type === 'image/png' ? true : Upload.LIST_IGNORE;
    // },
    onChange: (info: UploadChangeParam<UploadFile<any>>) => {
      console.log(info.fileList);
    },
  };

  return (
    <Modal
      destroyOnClose={true}
      closable
      centered
      title="Create Your Team"
      visible={isVisible}
      okText="Create"
      onOk={onFinish}
      onCancel={() => setIsVisible(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="teamName"
          hasFeedback
          label="Team Name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please input your team name',
            },
            { min: 5, message: 'Team name must be minimum 5 characters.' },
            { max: 25, message: 'Team name must be maximum 25 characters.' },
          ]}
        >
          <Input bordered placeholder="Input team name" type="text" name="name" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              whitespace: true,
            },
          ]}
          name="teamDescription"
          hasFeedback
          label="Description"
        >
          <TextArea bordered placeholder="Description of the team" rows={4} name="description" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input images' }]}
          name="upload"
          label="Upload"
          valuePropName="file"
          initialValue={`${config.SERVER_BASE_URL}/uploads/teamDefault.png`}
          getValueFromEvent={normFile}
        >
          <Upload
            action={`${config.SERVER_BASE_URL}/api/upload`}
            name="photo"
            multiple={false}
            withCredentials={true}
            listType="picture"
            maxCount={1}
            {...props}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="range-picker" label="RangePicker">
          <RangePicker />
        </Form.Item>
        <Form.Item name="select" label="Select">
          <Select defaultValue="public">
            <Select.Option value="private">Private</Select.Option>
            <Select.Option value="public">Public</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeamModal;
