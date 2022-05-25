import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, Tabs, Avatar, Upload, message, Row, Col, Select, DatePicker, Modal } from 'antd';
import { EditFilled, UploadOutlined, DeleteFilled, SaveFilled } from '@ant-design/icons';

import { useMutation, useQuery } from '@apollo/client';

import { TeamQueries } from '../../../grapql-client/queries';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import config from '../../../config';
import { TeamMutations } from '../../../grapql-client/mutations';
import { Member } from '../../../types';
import selfContext from '../../../contexts/selfContext';

import { Loading } from '../../../components/Loading';
import { TopNavBar } from '../../../components/TopNavBar';
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
  const { t } = useTranslation();

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

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);
  return (
    <Loading data={data?.team} loading={loading} error={error}>
      <>
        <TopNavBar iMember={iMember} team={data?.team} title="Team Details" />
        <div
          className="teamDetails site-layout-background flex flex-1 flex-dir-r"
          style={{ height: '100%', padding: '5px' }}
        >
          <>
            <div className="flex flex-2 " style={{ padding: '10px', height: '100%', overflow: 'auto' }}>
              {/* {(iMember?.isOwner || iMember?.isSuperOwner) && (
                <div className="team-button">
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
                </div>
              )} */}
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
                      style={{
                        display: 'flex',
                        padding: 30,
                        alignItems: 'baseline',
                        height: 50,
                        justifyContent: 'space-around',
                      }}
                    >
                      <h3 style={{ whiteSpace: 'nowrap' }}>{t(`txt_team_detail_name`)}</h3>
                      <Input style={{ width: 500 }} disabled={disabled} defaultValue={data?.team?.name} />{' '}
                    </div>
                    <div
                      className="team-desc"
                      style={{ display: 'flex', padding: 30, alignItems: 'baseline', justifyContent: 'space-around' }}
                    >
                      <h3 style={{ whiteSpace: 'nowrap' }}>{t(`txt_team_detail_desc`)}</h3>
                      <TextArea
                        style={{ height: 108, transition: 'none', resize: 'none', width: 500 }}
                        disabled={disabled}
                        defaultValue={data?.team?.description || undefined}
                      />
                    </div>
                  </Col>

                  <Col span={6}>
                    <div className="avatar" style={{ display: 'grid', textAlign: 'center', justifyItems: 'center' }}>
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
                          {t(`txt_team_detail_upload`)}
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
                  <Col span={18}>
                    <div
                      className="duration"
                      style={{
                        padding: 30,
                        display: 'flex',
                        alignItems: 'baseline',
                        height: 50,
                        justifyContent: 'space-around',
                        position: 'relative',
                        right: 58,
                      }}
                    >
                      <h3>{t(`txt_team_detail_duration`)}</h3>
                      {/* console.log() */}
                      {/* {console.log(startDate, endDate)} */}
                      <RangePicker
                        style={{ right: 114 }}
                        disabled={disabled}
                        defaultValue={[moment(new Date(+startDate)), moment(new Date(+endDate))]}
                      />
                    </div>
                    <div
                      className="status"
                      style={{
                        padding: 30,
                        display: 'flex',
                        alignItems: 'baseline',
                        height: 50,
                        justifyContent: 'space-around',
                      }}
                    >
                      <h3>{t(`txt_team_detail_status`)}</h3>
                      <Select disabled={disabled} defaultValue={data?.team.status} style={{ width: 500, left: 5 }}>
                        <Option value="DOING">{t(`txt_team_detail_doing`)}</Option>
                        <Option value="DONE">{t(`txt_team_detail_done`)}</Option>
                      </Select>
                    </div>
                    <div
                      className="scope"
                      style={{
                        padding: 30,
                        display: 'flex',
                        alignItems: 'baseline',
                        height: 50,
                        justifyContent: 'space-around',
                      }}
                    >
                      <h3>{t(`txt_team_detail_scope`)}</h3>
                      <Select
                        disabled={disabled}
                        defaultValue={data?.team.isPublic === false ? 'PRIVATE' : 'PUBLIC'}
                        style={{ width: 500, left: 7 }}
                      >
                        <Option value="PRIVATE">{t(`txt_team_detail_private`)}</Option>
                        <Option value="PUBLIC">{t(`txt_team_detail_public`)}</Option>
                      </Select>
                    </div>

                    <div
                      className="scope"
                      style={{ padding: 30, display: 'flex', justifyContent: 'space-around', position: 'relative', right: 115 }}
                    >
                      <h3>{t(`txt_team_detail_member`)}</h3>
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
                  <Col span={6}></Col>
                </Row>
              </div>
            </div>
          </>
        </div>
      </>
    </Loading>
  );
};

export default TeamDetail;
