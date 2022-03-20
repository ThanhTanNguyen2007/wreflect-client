import { gql } from '@apollo/client';
import { REMARK_FIELDS } from './remarkFragment';
import { USER_FIELDS } from './userFragment';
export const OPINION_FIELDS = gql`
  ${USER_FIELDS}
  ${REMARK_FIELDS}
  fragment OpinionFields on Opinion {
    id
    columnId
    memberId
    authorId
    createdAt
    updatedAt
    text
    upVote
    downVote
    updatedBy
    isAction
    isBookmarked
    responsible
    mergedAuthors
    color
    status
    position
    author {
      ...UserFields
    }
    remarks {
      ...RemarkFields
    }
  }
`;
