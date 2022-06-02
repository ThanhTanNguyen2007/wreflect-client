import { OpinionStatus } from './../../types';
import { TEAM_FIELDS } from './../fragments/teamFragment';
import { gql } from '@apollo/client';
import { Team } from '../../types';

export type createTeamVars = {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  isPublic?: boolean;
  picture?: string;
};

export type createTeamResult = {
  createTeam: Team;
};

export const createTeam = gql`
  mutation createTeam(
    $name: String!
    $startDate: String!
    $endDate: String!
    $description: String
    $isPublic: Boolean
    $picture: String
  ) {
    createTeam(
      name: $name
      startDate: $startDate
      endDate: $endDate
      description: $description
      isPublic: $isPublic
      picture: $picture
    ) {
      id
      name
      createdAt
      startDate
      endDate
      status
      picture
      isPublic
      description
    }
  }
`;

export type updateTeamResult = {
  updateTeam: Team;
};
export type updateTeamVars = {
  teamId: string;
  name: string;
  startDate: string;
  endDate: string;
  picture: string;
  isPublic: boolean;
  description: string;
};
export const updateTeam = gql`
  ${TEAM_FIELDS}
  mutation updateTeam(
    $teamId: ID!
    $name: String!
    $startDate: String!
    $endDate: String!
    $picture: String!
    $isPublic: Boolean!
    $description: String!
  ) {
    updateTeam(
      teamId: $teamId
      name: $name
      startDate: $startDate
      endDate: $endDate
      isPublic: $isPublic
      picture: $picture
      description: $description
    ) {
      ...TeamFields
    }
  }
`;

export type deleteTeamResult = {
  deleteTeam: Team;
};
export type deleteTeamVars = {
  teamId: string;
};
export const deleteTeam = gql`
  ${TEAM_FIELDS}
  mutation deleteTeam($teamId: ID!) {
    deleteTeam(teamId: $teamId) {
      ...TeamFields
    }
  }
`;

export type changeTeamAccessVars = {
  teamId: string;
  isPublic: boolean;
};

export type changeTeamAccessResult = {
  changeTeamAccess: {
    count: number;
  };
};

export const changeTeamAccess = gql`
  ${TEAM_FIELDS}
  mutation ChangeTeamAccess($teamId: String!, $isPublic: Boolean!) {
    changeTeamAccess(teamId: $teamId, isPublic: $isPublic) {
      ...TeamFields
    }
  }
`;

export type updateActionTrackerResult = {
  updateActionTracker: Team;
};

export type updateActionTrackerVars = {
  teamId: string;
  sourceBoardId: string;
  sourceColumnId: string;
  destinationBoardId: string;
  destinationColumnId: string;
  opinionId: string;
  responsible: string;
  status: OpinionStatus;
};

export const updateActionTracker = gql`
  ${TEAM_FIELDS}
  mutation updateActionTracker(
    $teamId: String!
    $sourceBoardId: String!
    $sourceColumnId: String!
    $destinationBoardId: String!
    $destinationColumnId: String!
    $opinionId: String!
    $responsible: String!
    $status: OpinionStatus!
  ) {
    updateActionTracker(
      teamId: $teamId
      sourceBoardId: $sourceBoardId
      sourceColumnId: $sourceColumnId
      destinationBoardId: $destinationBoardId
      destinationColumnId: $destinationColumnId
      opinionId: $opinionId
      responsible: $responsible
      status: $status
    ) {
      ...TeamFields
    }
  }
`;

export type joinTeamWithLinkResult = {
  joinTeamWithLink: Team;
};
export type joinTeamWithLinkVars = {
  teamId: string;
};
export const joinTeamWithLink = gql`
  ${TEAM_FIELDS}
  mutation joinTeamWithLink($teamId: String!) {
    joinTeamWithLink(teamId: $teamId) {
      ...TeamFields
    }
  }
`;
