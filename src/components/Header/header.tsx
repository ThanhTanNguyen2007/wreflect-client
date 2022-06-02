import React from 'react';
import { Button } from 'antd';

import { Login } from '../Login';
import { auth } from '../../apis';

type Props = {
  redirectUrl?: string;
  email: null | string;
};

const LoginSection = ({ email, redirectUrl }: Props) => {
  return (
    <Login redirectUri={redirectUrl} isLoggedIn={!!email}>
      <span>Login / Sign up</span>
    </Login>
  );
};

const Header = ({ email, redirectUrl }: Props) => {
  return (
    <div className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <div className="flex flex-dir-r flex-ai-e">
          <img height="50px" src="../../images/shortLogo.png" alt="wReflect Logo" />{' '}
          <div className="titlePage">WReflect</div>
        </div>
        <div style={{ flexGrow: 1, textAlign: 'right' }}>
          <LoginSection redirectUrl={redirectUrl} email={email} />
        </div>
      </div>
    </div>
  );
};

export default Header;
