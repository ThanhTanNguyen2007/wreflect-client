import React, { useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UserOutlined, DownOutlined, EditOutlined, RedoOutlined } from '@ant-design/icons';

import { UserMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

import { user } from '../../apis';
import { Avatar, Tabs, Button, Dropdown, Menu, notification, Empty } from 'antd';
import moment from 'moment';
import OwnedTeams from './ownedTeams';
import { UserQueries } from '../../grapql-client/queries';
import AnalyticComponent from './analytic';
import { t } from 'i18next';
import UploadAvatarModal from './UploadAvatarModal';
import { reloadSkillsResult, updateUserResult, updateUserVars } from '../../grapql-client/mutations/UserMutation';
import UpdateAccountModal from './UpdateAccountModal';

const { TabPane } = Tabs;

type Props = {
  userId: string;
};

const AccountSetting = ({ userId }: Props) => {
  const [isChangeAvatarVisible, setIsChangeAvatarVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisbile] = useState(false);
  const me = useContext(SelfContext);
  const [updateAccount] = useMutation<updateUserResult, updateUserVars>(UserMutations.updateUser, {
    onError: (error) => {
      notification.error({
        message: error?.message,
        placement: 'bottomRight',
      });
    },
  });

  const [reloadSkills] = useMutation<reloadSkillsResult>(UserMutations?.reloadSkills, {
    onCompleted: () => {
      notification?.success({
        message: 'Reload Skill Successfull',
        placement: 'bottomRight',
      });
    },
    onError: (error) => {
      notification?.error({
        message: error?.message,
        placement: 'bottomRight',
      });
    },
  });

  const { data: userProfile } = useQuery<UserQueries.getUserResult>(UserQueries?.getUser, {
    variables: {
      userId,
    },
  });

  const handleFinish = (values: any) => {
    updateAccount({ variables: { picture: values['email'] } });
    user.me();
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setIsChangeAvatarVisible(true)} key="1" icon={<UserOutlined />}>
        Change Avatar
      </Menu.Item>
      <Menu.Item onClick={() => setIsUpdateVisbile(true)} key="1" icon={<EditOutlined />}>
        Update Profile
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="profileUser non-scroll">
      <UpdateAccountModal
        userProfile={userProfile?.getUser}
        isVisible={isUpdateVisible}
        setIsVisible={setIsUpdateVisbile}
      />
      <UploadAvatarModal isVisible={isChangeAvatarVisible} setIsVisible={setIsChangeAvatarVisible} />
      <div className="headerSection">
        <div className="accInfor">
          <Avatar size={70} src={userProfile?.getUser?.picture} />
          <div className="accName">
            <div className="gmail">{userProfile?.getUser?.nickname}</div>
            <p>
              {t(`txt_joinedAt`)}{' '}
              <span className="user_id">{moment(+userProfile?.getUser?.createdAt).format('DD/MM/YYYY')}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container scrollable" style={{ height: '100%' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile" key="1">
            <>
              <div className="actionField flex flex-dir-r flex-gap-10">
                <div className="actionHeader">
                  <Dropdown trigger={['click']} overlay={menu}>
                    <Button type="primary">
                      Action <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Picture:</div>
                  <div className="valueField flex-1">
                    <Avatar src={userProfile?.getUser?.picture} />
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Nickname:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.getUser?.nickname}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Email:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.getUser?.email}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Gender:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.getUser?.gender}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Status:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.getUser?.sessions?.length > 0 ? 'Online' : 'Offline'}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Introduction:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.getUser?.introduction}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Workplace:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.getUser?.workplace}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Interests:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.getUser?.interests}</div>
                  </div>
                </div>
              </div>
            </>
          </TabPane>
          <TabPane tab="Teams" key="2">
            <OwnedTeams />
          </TabPane>
          <TabPane tab="skills" key="3">
            <>
              <Button onClick={() => reloadSkills()} icon={<RedoOutlined />}>
                Refresh Data
              </Button>
              <div className="mt-10">
                {userProfile?.getUser?.skillValues?.length > 0 ? (
                  <>
                    Your skill chart here
                    <AnalyticComponent skillValues={userProfile?.getUser?.skillValues} />
                  </>
                ) : (
                  <div className="flex flex-1 flex-ai-c flex-jc-c">
                    <Empty description="No data skills to display" />
                  </div>
                )}
              </div>
            </>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSetting;
