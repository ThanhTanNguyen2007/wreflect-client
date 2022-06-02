import { axios } from './axios';

export const me = async () => {
  try {
    const response = await axios.get('/me');
    return response?.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const changeAvatar = async (picture: string) => {
  try {
    const response = await axios?.post('/changeAvatar', {
      picture,
    });
    return response?.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
