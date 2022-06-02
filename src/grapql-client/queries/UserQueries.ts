import { User } from './../../types';
import { PageHeader } from 'antd';
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

export type getUserResult = {
  getUser: User;
};

export type getUserVars = {
  userId?: string;
};

const getUser = gql`
  ${USER_FIELDS}
  query getUser($userId: ID) {
    getUser(userId: $userId) {
      ...UserFields
    }
  }
`;

export type getUsersResult = {
  getUsers: {
    data: User[];
    total: number;
    page: number;
    size: number;
  };
};
export type getUsersVars = {
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};
export const getUsers = gql`
  ${USER_FIELDS}
  query getUsers($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    getUsers(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...UserFields
      }
      total
      page
      size
    }
  }
`;

export { login, me, getUser };
