import { TEMPLATE_FIELDS } from './../fragments/templateFragment';
import { HEALTH_CHECK_FIELDS } from './../fragments/healthCheckFragment';
import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { HealthCheck } from './../../types';
import { gql } from '@apollo/client';
import { MemberAnswer, MemberComment, StatusHealthCheck } from '../../types';

export type createHealthCheckResult = {
  startSurveyHealthCheck: HealthCheck;
};
export type createHealthCheckVars = {
  teamId: string;
  boardId: string;
  isAnonymous: boolean;
  templateId: string;
};
export const createHealthCheck = gql`
  ${HEALTH_CHECK_FIELDS}
  mutation Mutation($teamId: String!, $boardId: String!, $isAnonymous: Boolean!, $templateId: String!) {
    createHealthCheck(teamId: $teamId, boardId: $boardId, isAnonymous: $isAnonymous, templateId: $templateId) {
      ...HealthCheckFields
    }
  }
`;

export type submitHealthCheckAnswerResult = {
  submitHealthCheckAnswer: HealthCheck;
};
export type submitHealthCheckAnswerVars = {
  teamId: string;
  boardId: string;
  answers: {
    questionId: string;
    point: number;
    comment: string;
  }[];
};
export const submitHealthCheckAnswer = gql`
  ${HEALTH_CHECK_FIELDS}
  mutation submitHealthCheckAnswer($teamId: String!, $boardId: String!, $answers: [healthCheckAnswer]!) {
    submitHealthCheckAnswer(teamId: $teamId, boardId: $boardId, answers: $answers) {
      ...HealthCheckFields
    }
  }
`;

export type reopenHealthCheckResult = {
  reopenHealthCheck: HealthCheck;
};

export type reopenHealthCheckVars = {
  teamId: string;
  boardId: string;
};

export const reopenHealthCheck = gql`
  ${HEALTH_CHECK_FIELDS}
  mutation Mutation($teamId: String!, $boardId: String!) {
    reopenHealthCheck(teamId: $teamId, boardId: $boardId) {
      ...HealthCheckFields
    }
  }
`;
