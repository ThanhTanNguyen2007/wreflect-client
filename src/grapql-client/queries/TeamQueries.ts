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

export type getTeamsResult = {
  teams: {
    data: Team[];
    total: number;
    page: number;
    size: number;
  };
};

enum statusOfTeam {
  DOING,
  DONE,
}

export type getTeamsVars = {
  status?: TeamStatus;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

const getTeams = gql`
  ${TEAM_FIELDS}
  query Teams($status: String, $isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    teams(status: $status, isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...TeamFields
      }
      total
    }
  }
`;

export type getOwnedTeamsResult = {
  getOwnedTeams: {
    data: Team[];
    total: number;
    page: number;
    size: number;
  };
};

export type getOwnedTeamsVars = {
  status?: TeamStatus;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

export const getOwnedTeams = gql`
  ${TEAM_FIELDS}
  query getOwnedTeams($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    getOwnedTeams(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...TeamFields
      }
      total
    }
  }
`;
export { getTeams, getTeam };
