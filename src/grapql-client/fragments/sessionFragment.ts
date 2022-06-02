import { gql } from '@apollo/client';
export const SESSION_FIELDS = gql`
  fragment SessionFields on Session {
    id
    userId
    token
    expiresAt
    data
    createdAt
    updatedAt
  }
`;
