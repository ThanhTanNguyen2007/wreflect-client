import { gql } from '@apollo/client';

const login = gql`
  query login($code: String, $state: String) {
    login(code: $code, state: $state) {
      id
      name
      email
      picture
      status
    }
  }
`;

const me = gql`
  query me {
    me {
      id
      email
      createdAt
      updatedAt
      isAdmin
      userStatus
      name
      nickname
      picture
      profile {
        id
        userId
        workplace
        address
        school
        introduction
        talent
        interest
        createdAt
        updatedAt
        gender
      }
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
        team {
          id
          name
          ownerUserIds
          createdAt
          startDate
          endDate
          picture
          numOfMember
          isPublic
          status
          description
        }
      }
    }
  }
`;

const getUser = gql`
  query getUser($email: String!) {
    user(email: $email) {
      id
      email
      createdAt
      updatedAt
      isAdmin
      status
      members {
        id
        email
        isOwner
        teamId
        joinedAt
        assignedBy
        status
      }
      profile {
        id
        name
        nickname
        gender
        workplace
        userStatus
        school
        introduction
        talents
        interests
        createdAt
        updatedAt
        phoneNumbers
      }
    }
  }
`;

const getUsers = gql`
  query getUsers($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    users(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        id
        name
        email
        createdAt
        updatedAt
        isAdmin
        status
      }
      total
    }
  }
`;


export { login, me, getUsers, getUser };
