import React, { useState, useEffect, Suspense } from 'react';

import { User } from './types';
// import Routes from './Routes';
const Routes = React.lazy(() => import('./Routes'));

import { setUpdateLoginState, user } from './apis';
import SelfContext from './contexts/selfContext';

// import { createUploadLink } from 'apollo-upload-client';

import './styles/less/ant.less';
import { Spin } from 'antd';
import loading from './components/Loading/loading';
// const link = createUploadLink({ uri: 'http://localhost:4000/graphql', credentials: 'include' });

const App = (): JSX.Element => {
  const [me, setMe] = useState<null | User>(null);
  const [teamId, setTeamId] = useState<string>('');
  const [boardId, setBoardId] = useState<string>('');
  // const [constructor, setConstructor] = useState(true);

  setUpdateLoginState((newMe: null | User) => {
    setMe(newMe);
    localStorage.setItem('email', newMe?.email || '');
  });

  useEffect(() => {
    (async function () {
      await user.me();
    })();
  }, []);

  return (
    <SelfContext.Provider
      value={{
        ...me,
        teamId,
        setTeamId,
        boardId,
        setBoardId,
      }}
    >
      <Suspense
        fallback={
          <div className="flex flex-ai-c flex-jc-c" style={{ flex: 1, height: '100vh' }}>
            <Spin size="large" />
          </div>
        }
      >
        <Routes me={me} />
      </Suspense>
    </SelfContext.Provider>
  );
};

export default App;
