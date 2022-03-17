import { gql } from '@apollo/client';
import { HealthCheck, MemberAnswer, MemberComment } from '../../types';

export type reopenHealthCheckResult = {
  updateGetHealthCheckData: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

export type reopenHealthCheckVars = {
  boardId: string;
  meId: string;
};

export const updateGetHealthCheckData = gql`
  subscription UpdateGetHealthCheckData($meId: ID!, $boardId: String!) {
    updateGetHealthCheckData(meId: $meId, boardId: $boardId) {
      memberAnswers {
        id
        templateId
        updatedAt
        userId
        createdAt
        healthCheckId
        user {
          email
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
        userId
        questionId
        text
        user {
          email
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
