import { gql } from '@apollo/client';
import { CRITERIA_FIELDS } from './criteriaFragment';
export const USER_ON_CRITERIA_FIELDS = gql`
  ${CRITERIA_FIELDS}
  fragment UserOnCriteriaFields on UserOnCriteria {
    id
    userId
    criteriaId
    value
    criteria {
      ...CriteriaFields
    }
  }
`;
