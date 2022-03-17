import { HealthCheck, MemberAnswer, MemberComment } from './../../types';
import { gql } from '@apollo/client';

export type getBoardResult = {
  getHealthCheck: {
    memberAnswers: [MemberAnswer];
    memberComments: [MemberComment];
    healthCheck: HealthCheck;
  };
};

export type getBoardVars = {
  teamId: string;
  boardId: string;
};

export const getHealthCheck = gql`
  query getHealthCheck($teamId: String, $boardId: String) {
    getHealthCheck(teamId: $teamId, boardId: $boardId) {
      memberAnswers {
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
        userId
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
