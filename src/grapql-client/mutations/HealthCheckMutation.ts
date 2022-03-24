import { MEMBER_FIELDS } from './../fragments/memberFragment';
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
  ${MEMBER_FIELDS}
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
        memberId
        createdAt
        healthCheckId
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
  ${MEMBER_FIELDS}
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
        member {
          ...MemberFields
        }
        memberId
      }
      memberComments {
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
        memberId
        member {
          ...MemberFields
        }
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
  ${MEMBER_FIELDS}
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
        member {
          ...MemberFields
        }
        updatedAt
        memberId
      }
      memberComments {
        id
        templateId
        healthCheckId
        createdAt
        updatedAt
        memberId
        member {
          ...MemberFields
        }
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
