import React, { useState, useContext, useEffect, useRef } from 'react';

import { Menu, Layout, Modal, Tooltip, Row, Col, Tabs, Badge } from 'antd';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import {
  CompassOutlined,
  UsergroupDeleteOutlined,
  LogoutOutlined,
  GoldOutlined,
  BarChartOutlined,
  UserOutlined,
  BellOutlined,
  QuestionOutlined,
  UserSwitchOutlined,
  SlidersOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import Avatar from 'antd/lib/avatar/avatar';

import { auth } from '../../apis';
import { Logout } from '../Logout';
import selfContext from '../../contexts/selfContext';
import { NotificationQueries } from '../../grapql-client/queries';

const { Sider } = Layout;
const { TabPane } = Tabs;

type Props = {
  email: null | string;
  isAdmin: null | boolean;
};

const SideBar = ({ isAdmin }: Props) => {
  const [isSwitchAdmin, setIsSwitchAdmin] = useState(false);
  const [isCollapse, setIsCollapse] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const me = useContext(selfContext);
  const menuComp = useRef<Menu>(null);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setIsSwitchAdmin(isAdmin && location?.pathname?.includes('/admin'));
  }, [location?.pathname]);

  const onClickLogout = () => {
    Modal.confirm({
      title: 'Are you sure want to sign out',
      centered: true,
      okText: 'Sign Out',
      cancelText: 'Cancel',
      onOk: async () => {
        auth.logout();
        window.location.reload();
      },
    });
  };

  const { data: numUnSeenNoti } = useQuery<NotificationQueries.getNumOfUnSeenNotiResult>(
    NotificationQueries?.getNumOfUnSeenNoti,
  );

  return (
    <>
      {me && (
        <Sider
          className="sidebar"
          collapsible
          collapsed={isCollapse}
          onCollapse={(collapse) => setIsCollapse(collapse)}
        >
          <div className="ant-layout-logo flex flex-dir-r flex-ai-c ">
            <span style={{ marginLeft: '10px' }}>wR</span>
            <span className="title" style={isCollapse ? { opacity: 0 } : { opacity: 1, transition: '0.7s' }}>
              eflect
            </span>
          </div>
          <div className="flex flex-dir-r flex-ai-c flex-jc-c">
            <Tooltip title={me?.email} placement="left">
              <Avatar src={me?.picture} />
            </Tooltip>
          </div>
          {isSwitchAdmin && <div className="bold flex flex-ai-c flex-jc-c white mt-10">Admin</div>}
          <Menu className="flex flex-1" theme="dark" mode="inline">
            {isSwitchAdmin ? (
              <>
                <Menu.Item key="2" icon={<BarChartOutlined />}>
                  <Link to="/admin/team-managerment">Team Managerment</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UsergroupDeleteOutlined />}>
                  <Link to="/admin/user-managerment">User Managerment</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<PieChartOutlined />}>
                  <Link to="/admin/analysis">Analysis</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<SlidersOutlined />}>
                  <Link to="/admin/system-configuration">System Configuration</Link>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item style={{ marginTop: 10 }} icon={<GoldOutlined />} key="teams">
                  <Link to="/teams">Teams</Link>
                </Menu.Item>
                <Menu.Item icon={<CompassOutlined />} key="connect">
                  <Link to="/connect">Connect</Link>
                </Menu.Item>
                <Menu.Item
                  icon={
                    <Badge
                      style={isCollapse && { transform: 'translate(5px, 6px)' }}
                      size="small"
                      count={numUnSeenNoti?.getNumOfUnSeenNoti}
                    >
                      <BellOutlined style={{ color: 'white' }} />
                    </Badge>
                  }
                  key="notification"
                >
                  <Link to="/notifications">Notifications</Link>
                </Menu.Item>
                <Menu.Item icon={<UserOutlined />} key="account">
                  <Link to={`/profile/me`}>Account</Link>
                </Menu.Item>
                <Menu.Item icon={<QuestionOutlined />} onClick={handleShowModal}>
                  Help
                </Menu.Item>
              </>
            )}
            {isAdmin && (
              <Menu.Item onClick={() => setIsSwitchAdmin(!isSwitchAdmin)} key="11" icon={<UserSwitchOutlined />}>
                <Link to={isSwitchAdmin ? '/teams' : '/admin'}>Switch to {isSwitchAdmin ? 'User' : 'Admin'}</Link>
              </Menu.Item>
            )}
            <Menu.Item onClick={() => onClickLogout()} style={{ marginTop: 'auto' }} key="10" icon={<LogoutOutlined />}>
              <Logout>
                <>Sign out</>
              </Logout>
            </Menu.Item>
          </Menu>
          <Modal className="modal-userguide" title="User Guide" visible={showModal} onCancel={handleCancel}>
            <Row>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Create Team" key="1">
                  <iframe width="950" height="350" src="https://www.youtube.com/embed/G6C0enWSx-Q/"></iframe>{' '}
                </TabPane>
                <TabPane tab="Add member" key="2">
                  <iframe width="950" height="350" src="https://www.youtube.com/embed/eSSS5c9K4yw"></iframe>{' '}
                </TabPane>
                <TabPane tab="Do Reflect" key="3">
                  <iframe width="950" height="350" src="https://www.youtube.com/embed/QDSBj48JwRw/"></iframe>{' '}
                </TabPane>
              </Tabs>
            </Row>
          </Modal>
        </Sider>
      )}
    </>
  );
};

export default SideBar;
