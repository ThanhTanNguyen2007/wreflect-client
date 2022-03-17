import { gql } from '@apollo/client';

import { Opinion } from './../../types';
import { OPINION_FIELDS } from '../fragments/opinionFragments';

export type createRemarkResult = {
  createRemark: Opinion;
};

export type createRemarkVars = {
  teamId: string;
  boardId: string;
  columnId: string;
  opinionId: string;
  text: string;
};

export const createRemark = gql`
  ${OPINION_FIELDS}
  mutation Mutation($teamId: String!, $boardId: String!, $columnId: String!, $opinionId: String!, $text: String!) {
    createRemark(teamId: $teamId, boardId: $boardId, columnId: $columnId, opinionId: $opinionId, text: $text) {
      ...OpinionFields
    }
  }
`;

export type removeRemarkResult = {
  removeResult: Opinion;
};

export type removeRemarkVars = {
  teamId: string;
  boardId: string;
  columnId: string;
  opinionId: string;
  remarkId: string;
};

export const removeRemark = gql`
  ${OPINION_FIELDS}
  mutation RemoveRemark(
    $teamId: String!
    $opinionId: String!
    $boardId: String!
    $columnId: String!
    $remarkId: String!
  ) {
    removeRemark(teamId: $teamId, opinionId: $opinionId, boardId: $boardId, columnId: $columnId, remarkId: $remarkId) {
      ...OpinionFields
    }
  }
`;
