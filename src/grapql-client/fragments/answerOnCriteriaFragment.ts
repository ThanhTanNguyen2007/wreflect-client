import { CRITERIA_FIELDS } from './criteriaFragment';
import { gql } from '@apollo/client';
export const ANSWER_ON_CRITERIA_FIELDS = gql`
  ${CRITERIA_FIELDS}
  fragment AnswerOnCriteriaFields on AnswerOnCriteria {
    id
    criteriaId
    resultId
    point
    comment
    updatedAt
    criteria {
      ...CriteriaFields
    }
  }
`;
