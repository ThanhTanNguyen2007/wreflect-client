import { HealthCheck } from './../../types';
import { gql } from '@apollo/client';
import { MemberAnswer, MemberComment, StatusHealthCheck } from '../../types';

export type startSurveyResult = {
  startSurveyHealthCheck: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

export type startSurveyVars = {
  teamId: string;
  boardId: string;
  isAnonymous: boolean;
  isCustom: boolean;
  templateId: string;
  status: StatusHealthCheck;
};

export const startSurvey = gql`
  mutation Mutation(
    $teamId: String!
    $boardId: String!
    $isAnonymous: Boolean!
    $isCustom: Boolean!
    $templateId: String!
    $status: StatusHealthCheck!
  ) {
    startSurveyHealthCheck(
      teamId: $teamId
      boardId: $boardId
      isAnonymous: $isAnonymous
      isCustom: $isCustom
      templateId: $templateId
      status: $status
    ) {
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

export type setAnswerHealthCheckResult = {
  answerHealthCheck: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

export type setAnswerHealthCheckVars = {
  teamId: string;
  boardId: string;
  templateId: string;
  answers: { questionId: string; value: string }[];
  comments: { questionId: string; text: string }[];
};

export const setAnswerHealthCheck = gql`
  mutation Mutation(
    $teamId: String!
    $boardId: String!
    $templateId: String!
    $answers: [answerInput!]!
    $comments: [commentInput!]!
  ) {
    answerHealthCheck(
      teamId: $teamId
      boardId: $boardId
      templateId: $templateId
      answers: $answers
      comments: $comments
    ) {
      memberAnswers {
        answers {
          questionId
          value
        }
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
        userId
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

export type reopenHealthCheckResult = {
  reopenHealthCheck: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

export type reopenHealthCheckVars = {
  teamId: string;
  boardId: string;
};

export const reopenHealthCheck = gql`
  mutation Mutation($teamId: String!, $boardId: String!) {
    reopenHealthCheck(teamId: $teamId, boardId: $boardId) {
      memberAnswers {
        answers {
          questionId
          value
        }
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
        userId
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
