import React from 'react';
import { Image } from 'antd';
import { Header } from './../../components/Header';

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
    </div>
  );
};

export default HomePage;
