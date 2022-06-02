import { TEAM_FIELDS } from './../fragments/teamFragment';
import { BOARD_FIELDS } from './../fragments/boardFragment';
import { gql } from '@apollo/client';
import { Board } from '../../types';

export type updateBoardResult = {
  updateBoard: Board;
};

export type updateBoardVars = {
  meId: string;
  teamId: string;
};

export const updateBoard = gql`
  ${BOARD_FIELDS}
  subscription Subscription($meId: ID!, $teamId: ID!) {
    updateBoard(meId: $meId, teamId: $teamId) {
      ...BoardFields
    }
  }
`;

export type deleteBoardResult = {
  deleteBoard: Board;
};
export type deleteBoardVars = {
  meId: string;
  teamId: string;
};
export const deleteBoard = gql`
  ${TEAM_FIELDS}
  subscription Subscription($meId: ID!, $teamId: ID!) {
    deleteBoard(meId: $meId, teamId: $teamId) {
      ...TeamFields
    }
  }
`;

export type subOnUpdateMeetingNoteResult = {
  subOnUpdateMeetingNote: Board;
};
export type subOnUpdateMeetingNoteVars = {
  teamId: string;
  boardId: string;
};
export const subOnUpdateMeetingNote = gql`
  ${BOARD_FIELDS}
  subscription subOnUpdateMeetingNote($teamId: ID!, $boardId: ID!) {
    subOnUpdateMeetingNote(teamId: $teamId, boardId: $boardId) {
      ...BoardFields
    }
  }
`;
