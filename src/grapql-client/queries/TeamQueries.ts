import { gql } from '@apollo/client';
import { Team } from '../../types';

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
  ${BOARD_FIELDS}
  ${MEMBER_FIELDS}
  ${USER_FIELDS}
  query Query($teamId: String!) {
    team(teamId: $teamId) {
      ...TeamFields
      members {
        ...MemberFields
        user {
          ...UserFields
        }
      }
      boards {
        ...BoardFields
      }
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
  status?: statusOfTeam;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

const getTeams = gql`
  ${TEAM_FIELDS}
  ${BOARD_FIELDS}
  ${USER_FIELDS}
  ${MEMBER_FIELDS}
  query Teams($status: String, $isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    teams(status: $status, isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...TeamFields
        members {
          ...MemberFields
          user {
            ...UserFields
          }
        }
        boards {
          ...BoardFields
        }
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
  status?: statusOfTeam;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

export const getOwnedTeams = gql`
  query getOwnedTeams($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    getOwnedTeams(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        id
        name
        createdAt
        startDate
        endDate
        picture
        isPublic
        status
        description
        members {
          id
          userId
          teamId
          isOwner
          isPendingInvitation
          isGuess
          invitedBy
          joinedAt
          role
          user {
            id
            email
            createdAt
            updatedAt
            isAdmin
            userStatus
            nickname
            picture
          }
        }
        owner {
          email
          id
          createdAt
          updatedAt
          isAdmin
        }
      }
      total
    }
  }
`;
export { getTeams, getTeam };
