import { HEALTH_CHECK_FIELDS } from './../fragments/healthCheckFragment';
import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { HealthCheck } from './../../types';
import { gql } from '@apollo/client';

export type getBoardResult = {
  getHealthCheck: HealthCheck;
};

export type getBoardVars = {
  teamId: string;
  boardId: string;
};

export const getHealthCheck = gql`
  ${HEALTH_CHECK_FIELDS}
  query getHealthCheck($teamId: String, $boardId: String) {
    getHealthCheck(teamId: $teamId, boardId: $boardId) {
      ...HealthCheckFields
    }
  }
`;
