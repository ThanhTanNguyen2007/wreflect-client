import { ASSESSMENT_FIELDS } from './../fragments/assessmentFragment';
import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { Assessment } from './../../types';
import { gql } from '@apollo/client';

export enum sortAssessmentsByEnum {
  name = 'name',
  createdAt = 'createdAt',
  status = 'status',
}

export enum orderWithEnum {
  asc = 'asc',
  desc = 'desc',
}

export type getAssessmentsResult = {
  getAssessments: { data: Assessment[]; total: number; page: number; size: number };
};

export type getAssessmentsVars = {
  teamId: string;
  sortBy: sortAssessmentsByEnum;
  orderWith: orderWithEnum;
  isGettingAll?: boolean;
  page?: number;
  size?: number;
  search?: string;
};

export const getAssessments = gql`
  ${ASSESSMENT_FIELDS}
  ${MEMBER_FIELDS}
  query getAssessments(
    $teamId: String!
    $sortBy: sortBy
    $orderWith: orderWith
    $isGettingAll: Boolean
    $page: Int
    $size: Int
    $search: String
  ) {
    getAssessments(
      teamId: $teamId
      isGettingAll: $isGettingAll
      search: $search
      sortBy: $sortBy
      orderWith: $orderWith
      page: $page
      size: $size
    ) {
      data {
        ...AssessmentFields
      }
      total
    }
  }
`;

export type getAssessmentResult = {
  getAssessment: Assessment;
};

export type getAssessmentVars = {
  teamId: string;
  assessmentId: string;
};

export const getAssessment = gql`
  ${ASSESSMENT_FIELDS}
  query getAssessment($teamId: ID!, $assessmentId: ID!) {
    getAssessment(teamId: $teamId, assessmentId: $assessmentId) {
      ...AssessmentFields
    }
  }
`;
