import { MEMBER_FIELDS } from './../fragments/memberFragment';
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
  ${MEMBER_FIELDS}
  query getHealthCheck($teamId: String, $boardId: String) {
    getHealthCheck(teamId: $teamId, boardId: $boardId) {
      memberAnswers {
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
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
