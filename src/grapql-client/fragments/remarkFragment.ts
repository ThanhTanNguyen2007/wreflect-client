import { USER_FIELDS } from './userFragment';
import { gql } from '@apollo/client';
export const REMARK_FIELDS = gql`
  ${USER_FIELDS}
  fragment RemarkFields on Remark {
    id
    authorId
    opinionId
    text
    createdAt
    updatedAt
    author {
      ...UserFields
    }
  }
`;
