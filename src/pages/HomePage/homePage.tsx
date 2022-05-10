import React, { useEffect } from 'react';
import { Image } from 'antd';
import { Header } from './../../components/Header';
import CookieConsent, { Cookies, getCookieConsentValue } from 'react-cookie-consent';

type Props = {
  email: string | null;
  picture: string | null;
};

const HomePage = ({ email, picture }: Props) => {
  return (
    <div className="flex flex-1">
      <Header email={email} picture={picture} />
      <div className="flex flex-1 flex-dir-r flex-jc-sa flex-ai-c">
        <Image preview={false} src="/images/homePageMale.png" alt="image" />
        <Image preview={false} src="/images/homePageFemale.png" alt="image" />
      </div>
      <CookieConsent
        location="bottom"
        buttonText="Accept Cookies"
        cookieName="myAwesomeCookieName2"
        style={{ background: '#2B373B' }}
        buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
        expires={150}
      >
        <div className="flex flex-dir-c">
          This website uses cookies to access.
          <span style={{ fontSize: '10px' }}> Without cookies you cant access our website</span>
        </div>
      </CookieConsent>
    </div>
  );
};

export default HomePage;
