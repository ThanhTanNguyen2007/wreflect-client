import { Board } from './../../types';
import { gql } from '@apollo/client';

import { BOARD_FIELDS } from '../fragments/boardFragment';

export type getBoardsResult = {
  boards: Board[];
};

export type getBoardsVars = {
  teamId: string;
};

export const getBoards = gql`
  query Boards($teamId: String!) {
    boards(teamId: $teamId) {
      id
      teamId
      createdAt
      updatedAt
      createdBy
      isLocked
      isPublic
      disableDownVote
      disableUpVote
      votesLimit
      isAnonymous
      title
      endTime
      timerInProgress
      columns {
        id
        color
        title
        isActive
        opinions {
          id
          columnId
          authorId
          createdAt
          updatedAt
          text
          upVote
          downVote
          updatedBy
          isAction
          responsible
          isBookmarked
          mergedAuthors
          color
          status
          author {
            id
            email
          }
          remarks {
            id
            authorId
            opinionId
            text
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export type getBoardResult = {
  board: Board;
};

export type getBoardVars = {
  boardId: string;
};

export const getBoard = gql`
  ${BOARD_FIELDS}
  query Query($boardId: String) {
    board(boardId: $boardId) {
      ...BoardFields
    }
  }
`;
