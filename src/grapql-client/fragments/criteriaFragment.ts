import { gql } from '@apollo/client';

export const CRITERIA_FIELDS = gql`
  fragment CriteriaFields on Criteria {
    id
    name
    description
  }
`;
