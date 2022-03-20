import { BOARD_FIELDS } from './boardFragment';
import { gql } from '@apollo/client';
export const TEAM_FIELDS = gql`
  ${BOARD_FIELDS}
  fragment TeamFields on Team {
    id
    name
    createdAt
    startDate
    endDate
    picture
    isPublic
    status
    description
    boards {
      ...BoardFields
    }
  }
`;
