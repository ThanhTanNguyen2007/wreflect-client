import { gql } from '@apollo/client';
import { BOARD_FIELDS } from './boardFragment';
import { MEMBER_FIELDS } from './memberFragment';
export const TEAM_FIELDS = gql`
  ${BOARD_FIELDS}
  ${MEMBER_FIELDS}
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
    members {
      ...MemberFields
    }
  }
`;
