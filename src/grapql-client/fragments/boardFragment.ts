import { gql } from '@apollo/client';
import { COLUMN_FIELDS } from './columnFragment';
export const BOARD_FIELDS = gql`
  ${COLUMN_FIELDS}
  fragment BoardFields on Board {
    id
    teamId
    createdAt
    updatedAt
    createdBy
    isPublic
    isLocked
    disableDownVote
    disableUpVote
    isAnonymous
    votesLimit
    meetingNote
    title
    timerInProgress
    endTime
    type
    currentPhase
    columns {
      ...ColumnFields
    }
  }
`;
