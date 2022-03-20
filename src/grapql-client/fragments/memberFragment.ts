import { gql } from '@apollo/client';
export const MEMBER_FIELDS = gql`
  fragment MemberFields on Member {
    id
    userId
    teamId
    isOwner
    isPendingInvitation
    isGuess
    invitedBy
    joinedAt
    role
  }
`;
