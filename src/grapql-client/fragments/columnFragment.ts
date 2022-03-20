import { gql } from '@apollo/client';
import { OPINION_FIELDS } from './opinionFragments';
export const COLUMN_FIELDS = gql`
  ${OPINION_FIELDS}
  fragment ColumnFields on Column {
    id
    color
    title
    isActive
    boardId
    opinions {
      ...OpinionFields
     
    }
  }
`;
