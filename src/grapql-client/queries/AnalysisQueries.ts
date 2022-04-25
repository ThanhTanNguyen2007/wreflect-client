import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { CRITERIA_FIELDS } from './../fragments/criteriaFragment';
import { Assessment, Criteria, Member } from './../../types';
import { ASSESSMENT_FIELDS } from './../fragments/assessmentFragment';
import { gql } from '@apollo/client';

type areaRadarChartData = {
  isSubmit: boolean;
  criteria: Criteria;
  assessor: Member;
  point: number;
};

type rosePlotChartData = {
  criteria: Criteria;
  sum: number;
  count: number;
  avg: number;
};

export type getAnalysisAssessmentResult = {
  getAnalysisAssessment: {
    areaRadarChartData: [areaRadarChartData];
    rosePlotChartData: [rosePlotChartData];
  };
};

export type getAnalysisAssessmentVars = {
  teamId: string;
  assessmentId: string;
  memberId: string;
};

export const getAnalysisAssessment = gql`
  ${CRITERIA_FIELDS}
  ${MEMBER_FIELDS}
  query getAnalysisAssessment($teamId: String!, $assessmentId: String!, $memberId: String!) {
    getAnalysisAssessment(teamId: $teamId, assessmentId: $assessmentId, memberId: $memberId) {
      areaRadarChartData {
        point
        isSubmit
        criteria {
          ...CriteriaFields
        }
        assessor {
          ...MemberFields
        }
      }
      rosePlotChartData {
        sum
        count
        avg
        criteria {
          ...CriteriaFields
        }
      }
    }
  }
`;
