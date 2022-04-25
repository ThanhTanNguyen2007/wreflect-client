import { ASSESSMENT_FIELDS } from './../fragments/assessmentFragment';
import { TEAM_FIELDS } from './../fragments/teamFragment';
import { gql } from '@apollo/client';
import { Assessment, Result } from '../../types';

export type createAssessmentResult = {
  createAssessment: Assessment;
};

export type createAssessmentVars = {
  teamId: string;
  nameAssessment: string;
  startDate: string;
  endDate: string;
  criteriaList: string[];
  memberIds: string[];
};

export const createAssessment = gql`
  ${ASSESSMENT_FIELDS}
  mutation createAssessment(
    $teamId: String!
    $nameAssessment: String!
    $startDate: String!
    $endDate: String!
    $criteriaList: [String!]!
    $memberIds: [String]!
  ) {
    createAssessment(
      teamId: $teamId
      nameAssessment: $nameAssessment
      startDate: $startDate
      endDate: $endDate
      criteriaList: $criteriaList
      memberIds: $memberIds
    ) {
      ...AssessmentFields
    }
  }
`;

export type updateAssessmentResult = {
  updateAssessment: Assessment;
};

export type updateAssessmentVars = {
  teamId: string;
  assessmentId: string;
  assessmentName: string;
};

export const updateAssessment = gql`
  ${ASSESSMENT_FIELDS}
  mutation updateAssessment($teamId: String!, $assessmentId: String!, $assessmentName: String!) {
    updateAssessment(teamId: $teamId, assessmentId: $assessmentId, assessmentName: $assessmentName) {
      ...AssessmentFields
    }
  }
`;

export type deleteAssessmentResult = {
  deleteAssessment: Assessment;
};

export type deleteAssessmentVars = {
  teamId: string;
  assessmentId: string;
};

export const deleteAssessment = gql`
  ${ASSESSMENT_FIELDS}
  mutation deleteAssessment($teamId: String!, $assessmentId: String!) {
    deleteAssessment(teamId: $teamId, assessmentId: $assessmentId) {
      ...AssessmentFields
    }
  }
`;

export type submitDoPersonalResult = {
  doPersonalReflection: Assessment;
};

export type submitDoPersonalVars = {
  teamId: string;
  assessmentId: string;
  assessorId: string;
  results: {
    id: string;
    concerningMemberId: string;
    answerOnCriteriaList: {
      id: string;
      criteriaId: string;
      point: number;
      comment: string;
    }[];
  }[];
};

export const submitDoPersonalReflection = gql`
  ${ASSESSMENT_FIELDS}
  mutation DoPersonalReflection(
    $teamId: String!
    $assessmentId: String!
    $assessorId: String!
    $results: [ResultInput]
  ) {
    doPersonalReflection(teamId: $teamId, assessmentId: $assessmentId, assessorId: $assessorId, results: $results) {
      ...AssessmentFields
    }
  }
`;
