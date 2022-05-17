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
      <span>Login / Sign up</span>
    </Login>
  );
};

const Header = ({ email, picture }: Props) => {
  return (
    <div className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <div className="flex flex-dir-r flex-ai-e">
          <img height="50px" src="../../images/shortLogo.png" alt="wReflect Logo" />{' '}
          <div className="titlePage">WReflect</div>
        </div>
        <div style={{ flexGrow: 1, textAlign: 'right' }}>
          <LoginSection email={email} picture={picture} />
        </div>
      </div>
    </div>
  );
};

export default Header;
