import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

import { Login } from '../Login';
import { useTranslation } from 'react-i18next';

type Props = {
  redirectUrl?: string;
  email: null | string;
};

const LoginSection = ({ email, redirectUrl }: Props) => {
  return (
    <Login isLoggedIn={!!email}>
      <span style={{ width: 90 }}>Login</span>
    </Login>
  );
};

const Header = ({ email, redirectUrl }: Props) => {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<'en' | 'vi'>(i18n?.language as 'en' | 'vi');
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  return (
    <div className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <div className="flex flex-dir-r flex-ai-e">
          <img height="50px" src="../../images/shortLogo.png" alt="wReflect Logo" />{' '}
          <div className="titlePage">WReflect</div>
        </div>
        <div style={{ flexGrow: 80, textAlign: 'right' }}>
          <Button
            onClick={() => setLanguage(language == 'vi' ? 'en' : 'vi')}
            unselectable="on"
            key="12"
            icon={<span className={`flag-icon flag-icon-${language == 'vi' ? 'vn' : 'us'}`}></span>}
            style={{ width: 120 }}
          >
            &nbsp;{`${language == 'en' ? 'English' : 'Vietnam'}`}
          </Button>
        </div>
        <div style={{ flexGrow: 1, textAlign: 'right' }}>
          <LoginSection redirectUrl={redirectUrl} email={email} />
        </div>
      </div>
    </div>
  );
};

export default Header;
