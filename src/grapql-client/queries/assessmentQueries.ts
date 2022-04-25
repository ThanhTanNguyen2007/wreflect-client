import { ASSESSMENT_FIELDS } from './../fragments/assessmentFragment';
import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { Assessment } from './../../types';
import { gql } from '@apollo/client';

export enum filterOfGetAssessmentList {
  NAME = 'NAME',
  DATE = 'DATE',
  STATUS = 'STATUS',
}

export enum sortType {
  ASC = 'asc',
  DESC = 'desc',
}

export type getAssessmentsListResult = {
  getAssessmentsList: { data: Assessment[]; total: number; page: number; size: number };
};

export type getAssessmentsListVars = {
  teamId: string;
  isGettingAll: boolean;
  orderBy: filterOfGetAssessmentList;
  sort: sortType;
  offSet: number;
  limit: number;
  search?: string;
};

export const getAssessmentsList = gql`
  ${ASSESSMENT_FIELDS}
  ${MEMBER_FIELDS}
  query getAssessmentsList(
    $teamId: String!
    $isGettingAll: Boolean!
    $orderBy: filterOfAssessmentList!
    $sort: sortType!
    $offSet: Int!
    $limit: Int!
    $search: String
  ) {
    getAssessmentsList(
      teamId: $teamId
      isGettingAll: $isGettingAll
      orderBy: $orderBy
      sort: $sort
      offSet: $offSet
      limit: $limit
      search: $search
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
