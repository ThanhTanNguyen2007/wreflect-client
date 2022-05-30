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
export type updateTeamVars = {
  id: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  picture?: string;
  isPublic?: string;
  description?: string;
};

export type deleteTeamVars = {
  teamId: string;
};
export type createTeamResult = {
  createTeam: Team;
};
export type updateTeamResult = {
  updateTeam: Team;
};
export type deleteTeamResult = {
  deleteTeam: {
    count: number;
  };
};

const createTeam = gql`
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

const updateTeam = gql`
  ${TEAM_FIELDS}
  mutation updateTeam(
    $id: String!
    $name: String
    $startDate: String
    $endDate: String
    $status: String
    $picture: String
    $isPublic: Boolean
    $description: String
  ) {
    updateTeam(
      id: $id
      name: $name
      status: $status
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

const deleteTeam = gql`
  mutation deleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId) {
      count
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

const changeTeamAccess = gql`
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

const updateActionTracker = gql`
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

export { createTeam, updateTeam, deleteTeam, changeTeamAccess, updateActionTracker };
