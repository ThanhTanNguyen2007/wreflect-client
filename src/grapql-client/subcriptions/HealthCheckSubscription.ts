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
  ${MEMBER_FIELDS}
  subscription UpdateGetHealthCheckData($meId: ID!, $teamId: ID!) {
    subOnUpdateHealthCheck(meId: $meId, teamId: $teamId) {
      memberAnswers {
        id
        templateId
        updatedAt
        createdAt
        healthCheckId
        memberId
        member {
          ...MemberFields
        }
        answers {
          questionId
          value
        }
      }
      memberComments {
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
        memberId
        questionId
        text
        member {
          ...MemberFields
        }
      }
      healthCheck {
        id
        teamId
        boardId
        templateId
        createdAt
        createdBy
        updatedAt
        updatedBy
        isAnonymous
        isCustom
      }
    }
  }
`;
