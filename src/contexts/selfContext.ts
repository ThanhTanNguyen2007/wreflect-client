import React from 'react';
import { User } from '../types';

export default React.createContext<
  | null
  | (User & {
      teamId: string;
      boardId: string;
      setTeamId: (teamId: string) => void;
      setBoardId: (boardId: string) => void;
    })
>(null);
