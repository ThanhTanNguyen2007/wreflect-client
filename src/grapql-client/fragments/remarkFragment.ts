import { gql } from '@apollo/client';
import { MEMBER_FIELDS } from './memberFragment';
export const REMARK_FIELDS = gql`
  ${MEMBER_FIELDS}
  fragment RemarkFields on Remark {
    id
    authorId
    opinionId
    text
    createdAt
    updatedAt
    author {
      ...MemberFields
    }
  }
`;
