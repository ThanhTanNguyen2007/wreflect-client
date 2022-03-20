import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/userFragment';

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
  ${USER_FIELDS}
  query me {
    me {
      ...UserFields
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
