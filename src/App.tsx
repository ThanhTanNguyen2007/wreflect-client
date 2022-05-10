import React, { useState, useEffect, Suspense } from 'react';

import { User } from './types';
import Routes from './Routes';
// const Routes = React.lazy(() => import('./Routes'));

import { setUpdateLoginState, user } from './apis';
import SelfContext from './contexts/selfContext';
import './styles/less/ant.less';
import { Spin } from 'antd';

const App = (): JSX.Element => {
  const [me, setMe] = useState<null | User>(null);
  const [teamId, setTeamId] = useState<string>('');
  const [boardId, setBoardId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  // const [constructor, setConstructor] = useState(true);

  setUpdateLoginState((newMe: null | User) => {
    setMe(newMe);
    localStorage.setItem('email', newMe?.email || '');
  });

  useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);
        await user.me();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
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
      {isLoading ? (
        <div className="flex flex-ai-c flex-jc-c" style={{ flex: 1, height: '100vh' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Routes me={me} />
      )}
      {/* </Suspense> */}
    </SelfContext.Provider>
  );
};

export default App;
