import React, { useState, useContext } from 'react';
import { Input, Button, Tabs, Avatar, Upload, message, Row, Col, Select, DatePicker, Modal } from 'antd';
import { EditFilled, UploadOutlined, DeleteFilled, SaveFilled } from '@ant-design/icons';

import { useMutation, useQuery } from '@apollo/client';

import { TeamQueries } from '../../grapql-client/queries';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import config from '../../config';
import { TeamMutations } from '../../grapql-client/mutations';
import { Member } from '../../types';
import selfContext from '../../contexts/selfContext';

import { Loading } from '../../components/Loading';
import { TopNavBar } from '../../components/TopNavBar';
import moment from 'moment';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

type Props = {
  teamId: string;
};

const TeamDetail = ({ teamId }: Props) => {
  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  const [disabled, setDisabled] = useState(true);

  const key = 'updatable';
  const handleSave = () => {
    setDisabled(true);
    message.loading({ content: 'Loading...', key });
    setTimeout(() => {
      message.success({ content: 'Update infomation successfully', key, duration: 2 });
    }, 2000);
  };

  const props = {
    beforeUpload: async (file: RcFile) => {
      if (file.type !== 'image/png') {
        message.error(`${file.name} is not a png file`);
      }
      return file.type === 'image/png' ? true : Upload.LIST_IGNORE;
    },
    onChange: (info: UploadChangeParam<UploadFile<any>>) => {
      console.log(info.fileList);
    },
  };

  const startDate = moment(Number(data?.team.startDate)).format('DD-MM-YYYY');
  const endDate = moment(Number(data?.team.endDate)).format('DD-MM-YYYY');
  const me = useContext(selfContext);

  return (
    <>
      <TopNavBar team={data?.team} title="Team Settings" />
      <Loading refetch={refetch} data={data?.team} loading={loading} error={error}>
        <div
          className="teamDetails site-layout-background flex flex-1 flex-dir-r"
          style={{ height: '100%', padding: '5px' }}
        >
          <>
            <div className="flex flex-2 " style={{ padding: '10px', height: '100%', overflow: 'auto' }}>
              <div className="team-button">
                {me?.members.map((member) => {
                  return member.teamId === data?.team.id && member.isOwner === true ? (
                    <div style={{ float: 'right', margin: '0px 20px 20px 0px' }}>
                      <Button
                        shape="round"
                        icon={<DeleteFilled />}
                        danger
                        size="large"
                        style={{ width: '100px', marginRight: 10 }}
                        onClick={() => {
                          Modal.confirm({
                            title: 'Are you sure want to detele team',
                            centered: true,
                            okText: 'Delete',
                            cancelText: 'Cancel',
                          });
                        }}
                      >
                        Delete
                      </Button>

                      <Button
                        shape="round"
                        size="large"
                        icon={<EditFilled />}
                        style={{ width: '100px', marginRight: 10 }}
                        onClick={() => setDisabled(false)}
                      >
                        Edit
                      </Button>
                      <Button
                        shape="round"
                        type="primary"
                        size="large"
                        icon={<SaveFilled />}
                        style={{ width: '100px' }}
                        onClick={() => handleSave()}
                      >
                        Save
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
              <div
                className="team-above site-layout-background card"
                style={{
                  display: 'inline-block',
                  height: 250,
                  boxShadow:
                    'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
                }}
              >
                <Row style={{ paddingTop: 0, marginRight: 0 }}>
                  <Col span={18}>
                    <div
                      className="team-name"
                      style={{ display: 'flex', padding: 30, alignItems: 'baseline', height: 50 }}
                    >
                      <h3 style={{ whiteSpace: 'nowrap', marginRight: 100 }}>Team name</h3>
                      <Input disabled={disabled} defaultValue={data?.team?.name} />{' '}
                    </div>
                    <div className="team-desc" style={{ display: 'flex', padding: 30, alignItems: 'baseline' }}>
                      <h3 style={{ whiteSpace: 'nowrap', marginRight: 100 }}>Description</h3>
                      <TextArea
                        style={{ height: 108, transition: 'none', resize: 'none' }}
                        disabled={disabled}
                        defaultValue={data?.team?.description || undefined}
                      />
                    </div>
                  </Col>

                  <Col span={6}>
                    <div
                      className="avatar"
                      style={{ display: 'grid', textAlign: 'center', justifyItems: 'center', marginTop: 20 }}
                    >
                      <Avatar shape="circle" size={150} src={data?.team?.picture}></Avatar>
                      <Upload
                        action={`${config.SERVER_BASE_URL}/api/upload`}
                        name="photo"
                        multiple={false}
                        withCredentials={true}
                        listType="picture"
                        maxCount={1}
                        {...props}
                      >
                        <Button style={{ marginTop: 20 }} size="large" shape="round" icon={<UploadOutlined />}>
                          Upload
                        </Button>
                      </Upload>
                    </div>
                  </Col>
                </Row>
              </div>
              <div
                className="team-bottom site-layout-background card"
                style={{
                  display: 'inline-block',
                  height: 'fit-content',
                  margin: '30px 0px 30px 0px',
                  boxShadow:
                    'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
                }}
              >
                <Row style={{ paddingTop: 0, marginRight: 0 }}>
                  <Col span={24}>
                    <div
                      className="duration"
                      style={{ padding: 30, display: 'flex', alignItems: 'baseline', height: 50 }}
                    >
                      <h3 style={{ marginRight: 120 }}>Duration</h3>
                      <RangePicker disabled={disabled} defaultValue={[moment(`${startDate}`), moment(`${endDate}`)]} />
                    </div>
                    <div
                      className="status"
                      style={{ padding: 30, display: 'flex', alignItems: 'baseline', height: 50 }}
                    >
                      <h3 style={{ marginRight: 135 }}>Status</h3>
                      <Select disabled={disabled} defaultValue={data?.team.status} style={{ width: 720 }}>
                        <Option value="DOING">DOING</Option>
                        <Option value="DONE">DONE</Option>
                      </Select>
                    </div>
                    <div className="scope" style={{ padding: 30, display: 'flex', alignItems: 'baseline', height: 50 }}>
                      <h3 style={{ marginRight: 135 }}>Scope</h3>
                      <Select
                        disabled={disabled}
                        defaultValue={data?.team.isPublic === false ? 'PRIVATE' : 'PUBLIC'}
                        style={{ width: 720 }}
                      >
                        <Option value="PRIVATE">PRIVATE</Option>
                        <Option value="PUBLIC">PUBLIC</Option>
                      </Select>
                    </div>
                    <div className="scope" style={{ padding: 30, display: 'flex' }}>
                      <h3 style={{ marginRight: 120 }}>Member</h3>
                      <div>
                        <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                          {data?.team.members.map((member: Member) => {
                            return (
                              <Avatar
                                style={{ marginRight: '3px' }}
                                size="default"
                                // srcSet={member?.user?.picture}
                                key={member?.user?.email}
                                src={member?.user?.picture}
                              />
                            );
                          })}
                        </Avatar.Group>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        </div>
      </Loading>
    </>
  );
};

export default TeamDetail;
