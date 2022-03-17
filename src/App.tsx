import React, { useState, useEffect } from 'react';

import { User } from './types';
import Routes from './Routes';
import { setUpdateLoginState, user } from './apis';
import SelfContext from './contexts/selfContext';

// import { createUploadLink } from 'apollo-upload-client';

import './styles/less/ant.less';
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
      <Routes me={me} />
    </SelfContext.Provider>
  );
};

export default App;
