import { OPINION_FIELDS } from './../fragments/opinionFragments';
import { COLUMN_FIELDS } from './../fragments/columnFragment';
import { Board, Column, Opinion, OpinionStatus } from './../../types';
import { gql } from '@apollo/client';
import { BOARD_FIELDS } from '../fragments/boardFragment';

export type createOpinionVars = {
  teamId: string;
  boardId: string;
  columnId: string;
  text: string;
  isAction: boolean;
  isCreateBottom: boolean;
};

export type createOpinionResult = {
  createOpinion: Column;
};

export const createOpinion = gql`
  ${COLUMN_FIELDS}
  mutation Mutation(
    $teamId: String!
    $boardId: String!
    $columnId: String!
    $text: String
    $isAction: Boolean
    $isCreateBottom: Boolean
  ) {
    createOpinion(
      teamId: $teamId
      boardId: $boardId
      columnId: $columnId
      text: $text
      isAction: $isAction
      isCreateBottom: $isCreateBottom
    ) {
      ...ColumnFields
    }
  }
`;

export type convertToActionResult = {
  convertToAction: Opinion;
};

export type convertToActionVars = {
  teamId: string;
  boardId: string;
  columnId: string;
  opinionId: string;
  isAction: boolean;
};

export const convertOpinion = gql`
  ${OPINION_FIELDS}
  mutation convertOpinion(
    $teamId: String!
    $boardId: String!
    $columnId: String!
    $opinionId: String!
    $isAction: Boolean!
  ) {
    convertOpinion(
      teamId: $teamId
      boardId: $boardId
      columnId: $columnId
      opinionId: $opinionId
      isAction: $isAction
    ) {
      ...OpinionFields
    }
  }
`;

export type updateOpinionResult = {
  updateOpinion: Opinion;
};

export type updateOpinionVars = {
  teamId: string;
  opinionId: string;
  text?: string;
  upVote?: string[];
  downVote?: string[];
  isAction?: boolean;
  isBookmarked?: boolean;
  responsible?: string;
  color?: string;
  status?: OpinionStatus;
  newColumnId?: string;
};

export const updateOpinion = gql`
  ${OPINION_FIELDS}
  mutation updateOpinion(
    $teamId: String!
    $opinionId: String!
    $text: String
    $upVote: [String]
    $downVote: [String]
    $isAction: Boolean
    $isBookmarked: Boolean
    $responsible: String
    $color: String
    $status: OpinionStatus
    $newColumnId: String
  ) {
    updateOpinion(
      teamId: $teamId
      opinionId: $opinionId
      text: $text
      upVote: $upVote
      downVote: $downVote
      isAction: $isAction
      isBookmarked: $isBookmarked
      responsible: $responsible
      color: $color
      status: $status
      newColumnId: $newColumnId
    ) {
      ...OpinionFields
    }
  }
`;

export type removeOpinionResult = {
  removeOpinion: Board;
};

export type removeOpinionVars = {
  teamId: string;
  boardId: string;
  columnId: string;
  opinionId: string;
};

export const removeOpinion = gql`
  ${COLUMN_FIELDS}
  mutation RemoveOpinion($teamId: String!, $boardId: String!, $columnId: String!, $opinionId: String!) {
    removeOpinion(teamId: $teamId, boardId: $boardId, columnId: $columnId, opinionId: $opinionId) {
      ...ColumnFields
    }
  }
`;

export type combineOpinionResult = {
  combineOpinion: string;
};

export type combineOpinionVars = {
  teamId: string;
  boardId: string;
  combine: {
    draggableId: string;
    droppableId: string;
  };
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
  text: string;
};

export const combineOpinion = gql`
  ${BOARD_FIELDS}
  mutation Mutation(
    $teamId: String!
    $boardId: String!
    $combine: combineOpinion
    $source: orderOpinion
    $draggableId: String
    $text: String
  ) {
    combineOpinion(
      teamId: $teamId
      boardId: $boardId
      combine: $combine
      source: $source
      draggableId: $draggableId
      text: $text
    ) {
      ...BoardFields
    }
  }
`;
