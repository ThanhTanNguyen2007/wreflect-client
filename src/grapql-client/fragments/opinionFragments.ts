import { MEMBER_FIELDS } from './memberFragment';
import { gql } from '@apollo/client';
import { REMARK_FIELDS } from './remarkFragment';
export const OPINION_FIELDS = gql`
  ${MEMBER_FIELDS}
  ${REMARK_FIELDS}
  fragment OpinionFields on Opinion {
    id
    columnId
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
      ...MemberFields
    }
    remarks {
      ...RemarkFields
    }
  }
`;
