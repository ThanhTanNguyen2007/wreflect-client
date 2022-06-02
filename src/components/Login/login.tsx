import React, { useEffect, useState } from 'react';
import auth0, { AuthOptions } from 'auth0-js';

import config from '../../config';
import H from 'history';
import { auth, user } from '../../apis';
import EmailVerificationNotice from './EmailVerificationNotice';
import { createSemanticDiagnosticsBuilderProgram } from 'typescript';
import { useHistory } from 'react-router-dom';
import { Anchor, Button } from 'antd';

type Props = {
  isLoggedIn: boolean;
  children: JSX.Element;
  redirectUri?: string;
};

const Login = ({ isLoggedIn, children, redirectUri }: Props): JSX.Element => {
  const history = useHistory();
  const [email, setEmail] = useState<null | string>(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState<null | boolean>(null);
  const [sub, setSub] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(location.search);
  const authConfig: AuthOptions = config.AUTH0_WEBAUTH_CONFIG;

  if (redirectUri) {
    // authConfig.redirectUri = `${config?.AUTH0_WEBAUTH_CONFIG?.redirectUri}${redirectUri}`;
    // console.log(`${config?.AUTH0_WEBAUTH_CONFIG?.redirectUri}${redirectUri}`);
    // authConfig.universalLoginPage = true;
  }
  if (redirectUri) {
    localStorage?.setItem('redirect', redirectUri);
  }

  // let isMounted = true;
  const handleLogin = async (
    code: string,
    state: string,
    setEmail: React.Dispatch<null | string>,
    setNeedsEmailVerification: React.Dispatch<null | boolean>,
    setSub: (sub: string) => void,
    history: H.History,
  ) => {
    setLoading(true);
    // const INTENDED = `${config?.AUTH0_WEBAUTH_CONFIG?.redirectUri}${redirectUri}`;
    const res = await auth.login(code, state);
    if (!res) {
      return;
    }
    // if (isMounted) {
    if (res.sub) {
      setSub(res.sub);
    }

    if (res.requiresEmailVerification) {
      setNeedsEmailVerification(res.requiresEmailVerification);
    }

    if (res.email) {
      setEmail(res.email);
    }
    // }

    //Clear search params
    const indexOfSearchParams = location.href.indexOf('&code');
    const clearedUrl = indexOfSearchParams !== -1 ? location.href.substring(0, indexOfSearchParams) : location.href;
    window.history.replaceState({}, '', clearedUrl);

    const { partnerId, isAdmin } = await user.me();
    setLoading(false);
    if (location.pathname.includes('wa-client')) {
      return;
    }
    const redirectLink = localStorage?.getItem('redirect');
    if (redirectLink) {
      localStorage?.removeItem('redirect');
      history.push(`${redirectLink}`);
    }

    if (partnerId || isAdmin) {
      history.push('/admin/user-managerment');
    }
  };

  const webAuth = new auth0.WebAuth(authConfig);
  useEffect(() => {
    if (!isLoggedIn) {
      const code = params.get('code');
      const state = params.get('state');
      if (code && state) {
        handleLogin(code, state, setEmail, setNeedsEmailVerification, setSub, history);
      }
    }
    // return () => {
    //   isMounted = false;
    // };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const loggedEmail = localStorage.getItem('email');
      if (!!loggedEmail) {
        setEmail(loggedEmail);
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="App login-scene">
      <EmailVerificationNotice
        email={email}
        sub={sub}
        webAuth={webAuth}
        needsEmailVerification={needsEmailVerification}
      />
      <Button type="primary" loading={loading} onClick={() => webAuth.authorize({ prompt: 'login' })}>
        {children}
      </Button>
    </div>
  );
};

export default Login;
