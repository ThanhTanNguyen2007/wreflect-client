import { gql } from '@apollo/client';
import { User } from '../../types';
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

export type getUserResult = {
  account: User;
};

const getUser = gql`
  ${USER_FIELDS}
  query getUser {
    account {
      ...UserFields
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
