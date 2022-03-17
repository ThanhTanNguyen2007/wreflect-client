import { axios } from './axios';

type LoginResponse = {
  email: string;
  requiresEmailVerification?: boolean;
  sub?: string;
};

type SendVerificationResponse = {
  status: string;
};

const login = async (code: string, state: string) => {
  try {
    const res = await axios.post('/login', { code, state });
    return <LoginResponse>res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const logout = async () => {
  try {
    await axios.post('/logout');
  } catch (error) {
    console.log(error);
  }
};

const resendVerificationEmail = async (sub: string) => {
  try {
    const res = await axios.post('/resend_verification_email', { sub });
    return <SendVerificationResponse>res.data;
  } catch (error) {
    console.log(error);
  }
};

export { login, logout, resendVerificationEmail };
