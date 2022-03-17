import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Logout } from '../../../Logout';

import { Menu, Dropdown, Modal, Input, Avatar, Upload, Button, message, Select } from 'antd';
import {
  CaretDownOutlined,
  UserOutlined,
  TeamOutlined,
  StockOutlined,
  LogoutOutlined,
  SettingOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';

type Props = {
  email: string | null;
  picture: string | null;
};

const DropDown = ({ email, picture }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const key = 'updatable';
  const handleOk = () => {
    setIsModalVisible(false);
    message.loading({ content: 'Loading...', key });
    setTimeout(() => {
      message.success({ content: 'Update infomation successfully', key, duration: 2 });
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const history = useHistory();
  const redirect = () => {
    history.push('/me');
  };
  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const menu = (
    <Menu style={{ marginTop: '20px' }}>
      <Menu.Item key="0" icon={<SmileOutlined />}>
        <Link to="/me">My Profile</Link>
      </Menu.Item>
      <Menu.Item key="1" icon={<TeamOutlined />}>
        <Link to="/">My team</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<StockOutlined />}>
        My Health Check
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        <Link to="/account">Manage Acount</Link>
      </Menu.Item>
      <Modal title="Manage Account" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ alignItems: 'center', flex: 1 }}>
          <Avatar className="avatarSetting" src={`${picture}`} style={{ height: 100, width: 100, marginLeft: 180 }} />
        </div>
        <Upload {...props}>
          <Button style={{ marginLeft: 160, marginTop: 20 }} icon={<UploadOutlined />}>
            Upload image
          </Button>
        </Upload>
        <div style={{ marginTop: 10 }}>
          Email
          <Input placeholder="Email User..." value={`${email}`} disabled />
        </div>
        <div style={{ marginTop: 10 }}>
          <a href="https://dev-m0ubghav.us.auth0.com/u/reset-password/request/Username-Password-Authentication?state=hKFo2SBrSEZsQ1lyTUxybV84UzVfQ0F4N0V0SC1mbGh3bF9SdKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIG45WWFVelVyZmdDZjNDd3NHV3F0WnI2NldZNi1vNnY0o2NpZNkgMHpqbHh2d0taWDQ2aVVRWWMwQXJJcUUyOW9xdkh1U0w">
            <Button>Change Password</Button>
          </a>
        </div>
      </Modal>
      <Menu.Divider />
      <Menu.Item key="4" icon={<SettingOutlined />}>
        Setting
      </Menu.Item>
      <Menu.Item key="5" icon={<LogoutOutlined />}>
        <Logout>
          <>LogOut</>
        </Logout>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" style={{ color: 'black' }} onClick={(e) => e.preventDefault()}>
        <CaretDownOutlined />
      </a>
    </Dropdown>
  );
};
export default DropDown;
