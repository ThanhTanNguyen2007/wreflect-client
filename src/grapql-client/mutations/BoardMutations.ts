import { TEAM_FIELDS } from './../fragments/teamFragment';
import { gql } from '@apollo/client';
import { Board, BoardType, PhaseType } from '../../types';
import { BOARD_FIELDS } from '../fragments/boardFragment';

export type createBoardResult = {
  createBoard: Board;
};

export type createBoardVars = {
  teamId: string;
  isPublic?: boolean;
  isLocked?: boolean;
  disableDownVote?: boolean;
  disableUpVote?: boolean;
  isAnonymous?: boolean;
  votesLimit?: number;
  title: string;
  timerInProgress?: boolean;
  type?: BoardType;
  currentPhase?: PhaseType;
  endTime?: string;
  column1?: string;
  column2?: string;
  column3?: string;
  column4?: string;
  column5?: string;
  isActiveCol1?: boolean;
  isActiveCol2?: boolean;
  isActiveCol3?: boolean;
  isActiveCol4?: boolean;
  isActiveCol5?: boolean;
};

const createBoard = gql`
  ${TEAM_FIELDS}
  mutation Mutation(
    $teamId: String!
    $isPublic: Boolean
    $isLocked: Boolean
    $disableDownVote: Boolean
    $disableUpVote: Boolean
    $isAnonymous: Boolean
    $votesLimit: Int
    $title: String!
    $timerInProgress: Boolean
    $type: BoardType
    $currentPhase: PhaseType
    $endTime: String
    $column1: String
    $column2: String
    $column3: String
    $column4: String
    $column5: String
    $isActiveCol1: Boolean
    $isActiveCol2: Boolean
    $isActiveCol3: Boolean
    $isActiveCol4: Boolean
    $isActiveCol5: Boolean
  ) {
    createBoard(
      teamId: $teamId
      isPublic: $isPublic
      isLocked: $isLocked
      disableDownVote: $disableDownVote
      disableUpVote: $disableUpVote
      isAnonymous: $isAnonymous
      votesLimit: $votesLimit
      title: $title
      timerInProgress: $timerInProgress
      type: $type
      currentPhase: $currentPhase
      endTime: $endTime
      column1: $column1
      column2: $column2
      column3: $column3
      column4: $column4
      column5: $column5
      isActiveCol1: $isActiveCol1
      isActiveCol2: $isActiveCol2
      isActiveCol3: $isActiveCol3
      isActiveCol4: $isActiveCol4
      isActiveCol5: $isActiveCol5
    ) {
      ...TeamFields
    }
  }
`;

export type updateBoardResult = {
  updateBoard: Board;
};

export type updateBoardVars = {
  teamId: string;
  boardId: string;
  isPublic?: boolean;
  isLocked?: boolean;
  disableDownVote?: boolean;
  disableUpVote?: boolean;
  isAnonymous?: boolean;
  votesLimit?: number;
  title?: string;
  timerInProgress?: boolean;
  type?: BoardType;
  currentPhase?: PhaseType;
  endTime?: string;
  column1?: string;
  column2?: string;
  column3?: string;
  column4?: string;
  column5?: string;
  isActiveCol1?: boolean;
  isActiveCol2?: boolean;
  isActiveCol3?: boolean;
  isActiveCol4?: boolean;
  isActiveCol5?: boolean;
};

const updateBoard = gql`
  ${BOARD_FIELDS}
  mutation Mutation(
    $teamId: String!
    $boardId: String!
    $isPublic: Boolean
    $isLocked: Boolean
    $disableDownVote: Boolean
    $disableUpVote: Boolean
    $isAnonymous: Boolean
    $votesLimit: Int
    $title: String
    $timerInProgress: Boolean
    $type: BoardType
    $currentPhase: PhaseType
    $endTime: String
    $column1: String
    $column2: String
    $column3: String
    $column4: String
    $column5: String
    $isActiveCol1: Boolean
    $isActiveCol2: Boolean
    $isActiveCol3: Boolean
    $isActiveCol4: Boolean
    $isActiveCol5: Boolean
  ) {
    updateBoard(
      teamId: $teamId
      boardId: $boardId
      isPublic: $isPublic
      isLocked: $isLocked
      disableDownVote: $disableDownVote
      disableUpVote: $disableUpVote
      isAnonymous: $isAnonymous
      votesLimit: $votesLimit
      title: $title
      timerInProgress: $timerInProgress
      type: $type
      currentPhase: $currentPhase
      endTime: $endTime
      column1: $column1
      column2: $column2
      column3: $column3
      column4: $column4
      column5: $column5
      isActiveCol1: $isActiveCol1
      isActiveCol2: $isActiveCol2
      isActiveCol3: $isActiveCol3
      isActiveCol4: $isActiveCol4
      isActiveCol5: $isActiveCol5
    ) {
      ...BoardFields
    }
  }
`;

export type deleteBoardResult = {
  deleteBoard: Board;
};

export type deleteBoardVars = {
  teamId: string;
  boardId: string;
};

const deleteBoard = gql`
  ${TEAM_FIELDS}
  mutation Mutation($teamId: String!, $boardId: String!) {
    deleteBoard(teamId: $teamId, boardId: $boardId) {
      ...TeamFields
    }
  }
`;

export { createBoard, updateBoard, deleteBoard };
