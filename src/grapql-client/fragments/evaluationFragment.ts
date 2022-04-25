import { RESULT_FIELDS } from './resultFragment';
import { MEMBER_FIELDS } from './memberFragment';
import { CRITERIA_FIELDS } from './criteriaFragment';
import { gql } from '@apollo/client';
export const EVALUATION_FIELDS = gql`
  ${MEMBER_FIELDS}
  ${RESULT_FIELDS}
  fragment EvaluationFields on Evaluation {
    id
    name
    assessorId
    isSubmit
    assessmentId
    createdAt
    assessor {
      ...MemberFields
    }
    results {
      ...ResultFields
    }
  }
`;
