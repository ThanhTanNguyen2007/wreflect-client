import React from 'react';
import auth0 from 'auth0-js';
import { Anchor, notification } from 'antd';
import { auth } from '../../apis';

const { Link } = Anchor;

type EmailVerificationNoticeProps = {
  sub: null | string;
  email: null | string;
  needsEmailVerification: null | boolean;
  webAuth: auth0.WebAuth;
};

function EmailVerificationNotice({ sub, email, needsEmailVerification, webAuth }: EmailVerificationNoticeProps) {
  if (!email) {
    return null;
  }

  const handleOnResendVerification = async () => {
    const data = await auth.resendVerificationEmail(sub);
    if (data.status === 'pending') {
      notification.success({
        message: `Resend Successful`,
        description: 'Please check your email, your resend verification email successful',
        placement: 'bottomRight',
      });
    }
  };

  if (needsEmailVerification) {
    return (
      <>
        {notification.error({
          message: `Notification`,
          description: (
            <div>
              {`${email}, please visit your email to complete email verification. \n`}{' '}
              <a onClick={() => handleOnResendVerification()}>Resend?</a>
            </div>
          ),
          // description: `${email}, please visit your email to complete email verification.`,
          placement: 'bottomRight',
        })}
      </>
    );
  }

  return (
    <div className="emailVerificationNotice-scene">
      Welcome, {email}!
      {location.pathname.includes('workspace') ? (
        <>
          {' '}
          <a
            // style={{ cursor: 'pointer', color: '#007bff', fontWeight: 500 }}
            className="login__link"
            onClick={() => webAuth.authorize({ prompt: 'login' })}
          >
            Not you?
          </a>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default EmailVerificationNotice;
