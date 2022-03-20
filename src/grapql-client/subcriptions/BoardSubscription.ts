import { TEAM_FIELDS } from './../fragments/teamFragment';
import { BOARD_FIELDS } from './../fragments/boardFragment';
import { gql } from '@apollo/client';
import { Board } from '../../types';

export type updateBoardResult = {
  updateBoard: Board;
};

export type updateBoardVars = {
  meId: string;
  boardId: string;
};

export const updateBoard = gql`
  ${TEAM_FIELDS}
  ${BOARD_FIELDS}
  subscription Subscription($meId: ID!, $boardId: ID!) {
    updateBoard(meId: $meId, boardId: $boardId) {
      ...BoardFields
      team(meId: $meId) {
        ...TeamFields
      }
    }
  }
`;

export type deleteBoardResult = {
  deleteBoard: Board;
};

export type deleteBoardVars = {
  meId: string;
};

export const deleteBoard = gql`
  subscription Subscription($meId: ID!) {
    deleteBoard(meId: $meId) {
      id
      teamId
      createdAt
      updatedAt
      createdBy
      isPublic
      isLocked
      disableDownVote
      disableUpVote
      isAnonymous
      votesLimit
      title
      timerInProgress
      endTime
      type
      currentPhase
      team(meId: $meId) {
        id
        name
        startDate
        createdAt
        endDate
        picture
        isPublic
        status
        description
        boards {
          id
          teamId
          createdAt
          updatedAt
          createdBy
          isPublic
          isLocked
          disableDownVote
          disableUpVote
          isAnonymous
          votesLimit
          title
          timerInProgress
          endTime
          type
          currentPhase
        }
      }
      columns {
        id
        color
        title
        position
        isActive
        boardId
      }
    }
  }
`;
