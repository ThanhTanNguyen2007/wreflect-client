import React from 'react';
import { Button } from 'antd';

import { Login } from '../Login';

type Props = {
  email: null | string;
  picture: null | string;
};

const LoginSection = ({ email }: Props) => {
  return (
    <Login isLoggedIn={!!email}>
      <Button>Login / Sign up</Button>
    </Login>
  );
};

const Header = ({ email, picture }: Props) => {
  return (
    <div className="header" style={{ backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <div style={{ flexGrow: 1 }}>
          <img height="50px" src="../../images/logo.png" alt="wReflect Logo" />{' '}
        </div>
        <div style={{ flexGrow: 1, textAlign: 'right' }}>
          <LoginSection email={email} picture={picture} />
        </div>
      </div>
    </div>
  );
};

export default Header;
