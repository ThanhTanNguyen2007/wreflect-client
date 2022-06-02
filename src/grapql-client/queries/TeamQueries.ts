import { gql } from '@apollo/client';
import { Team, TeamStatus } from '../../types';

import { BOARD_FIELDS } from '../fragments/boardFragment';
import { MEMBER_FIELDS } from '../fragments/memberFragment';
import { TEAM_FIELDS } from '../fragments/teamFragment';
import { USER_FIELDS } from '../fragments/userFragment';

export type getTeamVars = {
  teamId: string;
};

export type getTeamResult = {
  team: Team;
};

const getTeam = gql`
  ${TEAM_FIELDS}
  query getTeam($teamId: String!) {
    team(teamId: $teamId) {
      ...TeamFields
    }
  }
`;

enum statusOfTeam {
  DOING,
  DONE,
}

export type getTeamsResult = {
  getTeams: {
    data: Team[];
    total: number;
    page: number;
    size: number;
  };
};
export type getTeamsVars = {
  status?: TeamStatus;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};
const getTeams = gql`
  ${TEAM_FIELDS}
  query getTeams($status: String, $isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    getTeams(status: $status, isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...TeamFields
      }
      total
    }
  }
`;

export type getTeamsOfUserResult = {
  getTeamsOfUser: {
    data: Team[];
    total: number;
    page: number;
    size: number;
  };
};

export type getTeamsOfUserVars = {
  status?: TeamStatus;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

export const getTeamsOfUser = gql`
  ${TEAM_FIELDS}
  query getTeamsOfUser($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    getTeamsOfUser(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...TeamFields
      }
      total
    }
  }
`;

export type checkInviteTeamResult = {
  checkInviteTeam: Team;
};
export type checkInviteTeamVars = {
  teamId: string;
};
export const checkInviteTeam = gql`
  ${TEAM_FIELDS}
  query checkInviteTeam($teamId: String) {
    checkInviteTeam(teamId: $teamId) {
      ...TeamFields
    }
  }
`;
export { getTeams, getTeam };
