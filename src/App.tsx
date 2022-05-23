import React, { useState, useEffect, Suspense } from 'react';

import { User } from './types';
import Routes from './Routes';
// const Routes = React.lazy(() => import('./Routes'));

import { auth, setUpdateLoginState, user } from './apis';
import SelfContext from './contexts/selfContext';
import { Spin } from 'antd';
import './styles/css/antd.css';
import './styles/css/style.css';
import 'flag-icon-css/css/flag-icons.min.css';
import _ from 'lodash';

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

  // useEffect(() => {
  //   return () => {
  //     if (!!me?.id) {
  //       window.addEventListener('beforeunload', (ev) => {
  //         ev.preventDefault();
  //         return auth.logout();
  //       });
  //     }
  //   };
  // });

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
