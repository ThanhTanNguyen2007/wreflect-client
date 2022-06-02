import React, { useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UserOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';

import { UserMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

import { user } from '../../apis';
import { Avatar, Tabs, Button, Dropdown, Menu, notification } from 'antd';
import moment from 'moment';
import OwnedTeams from './ownedTeams';
import { UserQueries } from '../../grapql-client/queries';
import AnalyticComponent from './analytic';
import { t } from 'i18next';
import UploadAvatarModal from './UploadAvatarModal';
import { updateUserResult, updateUserVars } from '../../grapql-client/mutations/UserMutation';
import UpdateAccountModal from './UpdateAccountModal';

const { TabPane } = Tabs;

type Props = {
  userId: string;
};

const AccountSetting = ({ userId }: Props) => {
  const [isChangeAvatarVisible, setIsChangeAvatarVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisbile] = useState(false);
  const me = useContext(SelfContext);
  const [updateAccount] = useMutation(UserMutations.updateUser, {
    onError: (error) => {
      notification.error({
        message: error?.message,
        placement: 'bottomRight',
      });
    },
  });

  const { data: userProfile } = useQuery<UserQueries.getUserResult>(UserQueries?.getUser);

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
    <div className="profileUser">
      <UpdateAccountModal
        userProfile={userProfile?.account}
        isVisible={isUpdateVisible}
        setIsVisible={setIsUpdateVisbile}
      />
      <UploadAvatarModal isVisible={isChangeAvatarVisible} setIsVisible={setIsChangeAvatarVisible} />
      <div className="headerSection">
        <div className="accInfor">
          <Avatar size={70} src={userProfile?.account?.picture} />
          <div className="accName">
            <div className="gmail">{userProfile?.account?.nickname}</div>
            <p>
              {t(`txt_joinedAt`)}{' '}
              <span className="user_id">{moment(+userProfile?.account?.createdAt).format('DD/MM/YYYY')}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container">
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
                    <Avatar src={userProfile?.account?.picture} />
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Name:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.account?.nickname}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Nickname:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.account?.email}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Gender:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.account?.gender}</div>
                  </div>
                </div>
              </div>
              <div className="inforField flex-1">
                <div className="hihihiha flex flex-dir-r flex-1">
                  <div className="labelField flex-1">Status:</div>
                  <div className="valueField flex-1">
                    <div>{userProfile?.account?.sessions?.length > 0 ? 'Online' : 'Offline'}</div>
                  </div>
                </div>
              </div>
            </>
          </TabPane>
          <TabPane tab="Teams" key="2">
            <OwnedTeams />
          </TabPane>
          <TabPane tab="skills" key="3">
            Your skill chart here
            <AnalyticComponent skillValues={userProfile?.account?.skillValues} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSetting;
