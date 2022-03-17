import { gql } from '@apollo/client';
import { Board } from '../../types';

export type updateBoardResult = {
  updateBoard: Board;
};

export type updateBoardVars = {
  meId: string;
};

export const updateBoard = gql`
  subscription Subscription($meId: ID!) {
    updateBoard(meId: $meId) {
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
      type
      currentPhase
      team(meId: $meId) {
        id
        name
        ownerUserIds
        startDate
        createdAt
        endDate
        picture
        numOfMember
        isPublic
        status
        description
        boards {
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
          type
          currentPhase
        }
      }
      columns {
        id
        color
        title
        position
        isActive
        boardId
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
          isAction
          updatedBy
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
          }
        }
      }
    }
  }
`;

export type deleteBoardResult = {
  deleteBoard: Board;
};

export type deleteBoardVars = {
  meId: string;
};

export const deleteBoard = gql`
  subscription Subscription($meId: ID!) {
    deleteBoard(meId: $meId) {
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
      type
      currentPhase
      team(meId: $meId) {
        id
        name
        ownerUserIds
        startDate
        createdAt
        endDate
        picture
        numOfMember
        isPublic
        status
        description
        boards {
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
          type
          currentPhase
        }
      }
      columns {
        id
        color
        title
        position
        isActive
        boardId
      }
    }
  }
`;
