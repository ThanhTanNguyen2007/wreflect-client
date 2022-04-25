import { EVALUATION_FIELDS } from './evaluationFragment';
import { gql } from '@apollo/client';
import { MEMBER_FIELDS } from './memberFragment';
export const ASSESSMENT_FIELDS = gql`
  ${MEMBER_FIELDS}
  ${EVALUATION_FIELDS}
  fragment AssessmentFields on Assessment {
    id
    name
    startDate
    endDate
    teamId
    creatorId
    creator {
      ...MemberFields
    }
    status
    evaluations {
      ...EvaluationFields
    }
  }
`;
