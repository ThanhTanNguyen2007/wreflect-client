import { HEALTH_CHECK_FIELDS } from './../fragments/healthCheckFragment';
import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { gql } from '@apollo/client';
import { HealthCheck, MemberAnswer, MemberComment } from '../../types';

export type reopenHealthCheckResult = {
  subOnUpdateHealthCheck: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

export type reopenHealthCheckVars = {
  meId: string;
  teamId: string;
};

export const updateGetHealthCheckData = gql`
  ${HEALTH_CHECK_FIELDS}
  subscription UpdateGetHealthCheckData($meId: ID!, $teamId: ID!) {
    subOnUpdateHealthCheck(meId: $meId, teamId: $teamId) {
      ...HealthCheckFields
    }
  }
`;
