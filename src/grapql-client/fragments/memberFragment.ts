import { gql } from '@apollo/client';
import { USER_FIELDS } from './userFragment';
export const MEMBER_FIELDS = gql`
  ${USER_FIELDS}
  fragment MemberFields on Member {
    id
    userId
    teamId
    isOwner
    isSuperOwner
    isPendingInvitation
    isGuess
    meetingNote
    invitedBy
    joinedAt
    user {
      ...UserFields
    }
  }
`;
