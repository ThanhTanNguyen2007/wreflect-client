import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, Tabs, Avatar, Upload, message, Row, Col, Select, DatePicker, Modal, Card } from 'antd';
import { EditFilled, UploadOutlined, DeleteFilled, SaveFilled, FormOutlined, DeleteOutlined } from '@ant-design/icons';

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
import UpdateTeamModal from './UpdateTeamModal';
import DeleteTeamModal from './DeleteTeamModal';

const { RangePicker } = DatePicker;

type Props = {
  teamId: string;
};

export default function TeamSetting({ teamId }: Props) {
  const [isUpdateTeamVisible, setIsUpdateTeamVisible] = useState(false);
  const [isDeleteTeamVisible, setIsDeleteTeamVisible] = useState(false);

  const { loading, data, error } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: { teamId },
  });

  const { t } = useTranslation();

  const me = useContext(selfContext);

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);
  return (
    <>
      <TopNavBar iMember={iMember} team={data?.team} title="Team Details" />
      <Loading data={data?.team} loading={loading} error={error}>
        <>
          <UpdateTeamModal team={data?.team} isVisible={isUpdateTeamVisible} setIsVisible={setIsUpdateTeamVisible} />
          <DeleteTeamModal team={data?.team} isVisible={isDeleteTeamVisible} setIsVisible={setIsDeleteTeamVisible} />
          <div className="teamSetting scrollable flex flex-gap-24 mt-10 p-20">
            <div>
              <div className="flex flex-dir-r flex-ai-c flex-gap-24">
                <Avatar className="avatar" shape="circle" size={150} src={data?.team?.picture}></Avatar>
                <div>
                  <h2 className="name" style={{ fontSize: '50px' }}>
                    {data?.team?.name}
                  </h2>
                  <p className="createdAt">
                    {t(`txt_team_detail_createdSince`)} {moment(+data?.team?.createdAt).format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
            </div>
            <Card>
              <div className="flex flex-gap-24">
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">{t(`txt_team_detail_name`)}:</h3>
                  <p className="flex-1">{data?.team?.name}</p>
                  <div className="flex-1 action flex flex-ai-e">
                    {(iMember?.isSuperOwner || iMember?.isOwner) && (
                      <Button onClick={() => setIsUpdateTeamVisible(true)} icon={<FormOutlined />}>
                        {t(`txt_edit`)}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">{t(`txt_team_detail_desc`)}:</h3>
                  <p className="flex-1" style={{ wordBreak: 'break-all' }}>
                    {data?.team?.description}
                  </p>
                  <div className="flex-1 action"></div>
                </div>
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">Avatar: </h3>
                  <p className="flex-1">
                    <Avatar
                      style={{ marginRight: '3px' }}
                      size="default"
                      // srcSet={member?.user?.picture}
                      key={data?.team?.id}
                      src={data?.team?.picture}
                    />
                  </p>
                  <div className="flex-1 action flex flex-ai-e"></div>
                </div>
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">{t(`txt_team_detail_scope`)}: </h3>
                  <p className="flex-1">{data?.team?.isPublic ? 'Public' : 'Private'}</p>
                  <div className="flex-1 action"></div>
                </div>
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">{t(`txt_team_detail_duration`)}: </h3>
                  <p className="flex-1">
                    <RangePicker
                      disabled={true}
                      defaultValue={[moment(+data?.team?.startDate), moment(+data?.team?.endDate)]}
                    />
                  </p>
                  <div className="flex-1 action flex flex-ai-e"></div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex flex-gap-24">
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">{t(`txt_team_detail_status`)}: </h3>
                  <p className="flex-1">{data?.team?.status}</p>
                  <div className="flex-1 action flex flex-ai-e"></div>
                </div>
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">{t(`txt_team_detail_member`)}: </h3>
                  <p className="flex-1">
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
                  </p>
                  <div className="flex-1 action flex flex-ai-e"></div>
                </div>
                <div className="flex flex-dir-r flex-gap-10">
                  <h3 className="flex-1 bold">{t(`txt_team_detail_numberOfBoard`)}: </h3>
                  <p className="flex-1">{data?.team?.boards?.length} Boards in a Team</p>
                  <div className="flex-1 action flex flex-ai-e"></div>
                </div>
              </div>
            </Card>
            {(iMember?.isSuperOwner || iMember?.isOwner) && (
              <div className="flex flex-ai-e">
                <Button onClick={() => setIsDeleteTeamVisible(true)} danger icon={<DeleteOutlined />}>
                  {t(`txt_delete`)} {t(`txt_team`)}
                </Button>
              </div>
            )}
          </div>
        </>
      </Loading>
    </>
  );
}
