import { gql } from '@apollo/client';
export const BOARD_FIELDS = gql`
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
    title
    timerInProgress
    endTime
    currentPhase
    columns {
      id
      color
      title
      isActive
      position
      opinions {
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
        status
        color
        position
        remarks {
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
        author {
          id
          email
          name
          nickname
          picture
        }
      }
      boardId
    }
    team {
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
  }
`;
