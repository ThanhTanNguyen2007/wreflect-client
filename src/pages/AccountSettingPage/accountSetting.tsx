import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

import { UserMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

import { user } from '../../apis';
import { Avatar, Tabs, Button, Dropdown, Menu } from 'antd';
import moment from 'moment';
import OwnedTeams from './ownedTeams';

const { TabPane } = Tabs;

type Props = {
  userId: string;
};

const AccountSetting = ({ userId }: Props) => {
  const me = useContext(SelfContext);
  const [updateAcctount] = useMutation(UserMutations.updateUser, {});

  const handleFinish = (values: any) => {
    updateAcctount({ variables: { picture: values['email'] } });
    user.me();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Change Avatar
      </Menu.Item>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Change Password
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        Forgot Password
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="profileUser">
      <div className="headerSection">
        <div className="accInfor">
          <Avatar size={70} src={me.picture} />
          <div className="accName">
            <div className="gmail">{me.email}</div>
            <p>
              user_id: <span className="user_id">{me.id}</span>
            </p>
          </div>
        </div>
        <div className="actionHeader">
          <Dropdown trigger={['click']} overlay={menu}>
            <Button type="primary">
              Action <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="container">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile" key="1">
            <div className="inforField">
              <div className="hihihiha">
                <div className="labelField">Name</div>
                <div className="valueField">
                  <div>{me.nickname}</div>
                </div>
                <div className="actionField">
                  <Button>Edit</Button>
                </div>
              </div>
            </div>
            <div className="inforField">
              <div className="hihihiha">
                <div className="labelField">data</div>
                <div className="valueField">
                  <div>{me.nickname}</div>
                </div>
                <div className="actionField">
                  <Button>Edit</Button>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Teams" key="2">
            <OwnedTeams />
          </TabPane>
          <TabPane tab="" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSetting;
