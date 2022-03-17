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
      id
      name
      createdAt
      startDate
      endDate
      picture
      isPublic
      description
      status
      members {
        id
        userId
        teamId
        isOwner
        isPendingInvitation
        isGuess
        invitedBy
        joinedAt
      }
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
  mutation ChangeTeamAccess($teamId: String!, $isPublic: Boolean!) {
    changeTeamAccess(teamId: $teamId, isPublic: $isPublic) {
      count
    }
  }
`;

export { createTeam, updateTeam, deleteTeam, changeTeamAccess };
