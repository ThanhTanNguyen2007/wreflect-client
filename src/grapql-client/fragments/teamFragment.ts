import { gql } from '@apollo/client';
export const TEAM_FIELDS = gql`
  fragment TeamFields on Team {
    id
    name
    createdAt
    ownerUserIds
    startDate
    endDate
    picture
    numOfMember
    isPublic
    status
    description
    members {
      id
      userId
      teamId
      isOwner
      isPendingInvitation
      isGuess
      invitedBy
      joinedAt
      role
      user {
        id
        email
        createdAt
        isAdmin
        updatedAt
        userStatus
        name
        nickname
        picture
      }
    }
    boards {
      id
      title
      isPublic
      isLocked
      createdAt
      updatedAt
      disableDownVote
      disableUpVote
    }
  }
`;
