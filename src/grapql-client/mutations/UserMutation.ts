import { USER_FIELDS } from './../fragments/userFragment';
import { gql } from '@apollo/client';
import { User } from '../../types';

export const updateUser = gql`
  mutation updateUser($picture: String) {
    updateUser(picture: $picture) {
      id
      email
      createdAt
      updatedAt
      isAdmin
      userStatus
    }
  }
`;

export type banUserResult = {
  banUser: User;
};
export type banUserVars = {
  userId: string;
  title: string;
  description: string;
  isBannedForever?: boolean;
  startDate?: string;
  endDate?: string;
};
export const banUser = gql`
  ${USER_FIELDS}
  mutation banUser(
    $userId: String!
    $title: String!
    $description: String!
    $isBannedForever: Boolean
    $startDate: String
    $endDate: String
  ) {
    banUser(
      userId: $userId
      title: $title
      description: $description
      isBannedForever: $isBannedForever
      startDate: $startDate
      endDate: $endDate
    ) {
      ...UserFields
    }
  }
`;
