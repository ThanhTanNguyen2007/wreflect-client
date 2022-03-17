import React, { useEffect, useState } from 'react';
import auth0, { AuthOptions } from 'auth0-js';

import config from '../../config';
import { auth } from '../../apis';
import EmailVerificationNotice from './EmailVerificationNotice';
import { createSemanticDiagnosticsBuilderProgram } from 'typescript';

type Props = {
  isLoggedIn: boolean;
  children: JSX.Element;
  redirectUri?: string;
};

const Login = ({ isLoggedIn, children, redirectUri }: Props): JSX.Element => {
  const [email, setEmail] = useState<null | string>(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState<null | boolean>(null);
  const [sub, setSub] = useState<null | string>(null);
  const params = new URLSearchParams(location.search);
  const authConfig: AuthOptions = config.AUTH0_WEBAUTH_CONFIG;

  let isMounted = true;
  const handleLogin = async (
    code: string,
    state: string,
    setEmail: React.Dispatch<null | string>,
    setNeedsEmailVerification: React.Dispatch<null | boolean>,
  ) => {
    const res = await auth.login(code, state);
    if (!res) {
      return;
    }
    if (isMounted) {
      if (res.sub) {
        setSub(res.sub);
      }

      if (res.requiresEmailVerification) {
        setNeedsEmailVerification(res.requiresEmailVerification);
      }

      if (res.email) {
        setEmail(res.email);
      }

      //Clear search params
      const indexOfSearchParams = location.href.indexOf('&code');
      const clearedUrl = indexOfSearchParams !== -1 ? location.href.substring(0, indexOfSearchParams) : location.href;
      window.history.replaceState({}, '', clearedUrl);
    }
  };

  if (redirectUri) {
    authConfig.redirectUri = redirectUri;
    authConfig.universalLoginPage = false;
  }
  const webAuth = new auth0.WebAuth(authConfig);
  useEffect(() => {
    if (!isLoggedIn) {
      const code = params.get('code');
      const state = params.get('state');
      if (code && state) {
        handleLogin(code, state, setEmail, setNeedsEmailVerification);
      }
    }
    return () => {
      isMounted = false;
    };
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
      <div onClick={() => webAuth.authorize({ prompt: 'login' })}>{children}</div>
    </div>
  );
};

export default Login;
