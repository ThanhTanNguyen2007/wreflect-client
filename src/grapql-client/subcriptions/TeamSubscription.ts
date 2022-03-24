import { TEAM_FIELDS } from './../fragments/teamFragment';
import { gql } from '@apollo/client';
import { Team } from '../../types';

export type subOnUpdateTeamsResult = {
  subOnUpdateTeams: {
    success: boolean;
  };
};

export type subOnUpdateTeamsVars = {
  meId: string;
};

export const subOnUpdateTeams = gql`
  subscription Teams($meId: ID!) {
    subOnUpdateTeams(meId: $meId) {
      success
    }
  }
`;

export type subOnUpdateTeamResult = {
  subOnUpdateTeam: Team;
};

export type subOnUpdateTeamVars = {
  meId: string;
  teamId: string;
};

export const subOnUpdateTeam = gql`
  ${TEAM_FIELDS}
  subscription subOnUpdateTeam($meId: ID!, $teamId: ID!) {
    subOnUpdateTeam(meId: $meId, teamId: $teamId) {
      ...TeamFields
    }
  }
`;
