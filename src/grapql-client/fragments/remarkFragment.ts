import { gql } from '@apollo/client';
export const REMARK_FIELDS = gql`
  fragment RemarkFields on Remark {
    id
    authorId
    opinionId
    text
    createdAt
    updatedAt
    author {
      id
      email
      name
      nickname
      picture
    }
  }
`;
