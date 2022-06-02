import { USER_FIELDS } from './../fragments/userFragment';
import { gql } from '@apollo/client';
import { Gender, User } from '../../types';

export type updateUserResult = {
  updateUser: User;
};
export type updateUserVars = {
  nickname?: string;
  picture?: string;
  gender?: Gender;
  workplace?: string;
  address?: string;
  school?: string;
  introduction?: string;
  talents?: string;
  interests?: string;
};
export const updateUser = gql`
  ${USER_FIELDS}
  mutation updateUser(
    $nickname: String
    $picture: String
    $gender: String
    $workplace: String
    $address: String
    $school: String
    $introduction: String
    $talents: String
    $interests: String
  ) {
    updateUser(
      nickname: $nickname
      picture: $picture
      gender: $gender
      workplace: $workplace
      address: $address
      school: $school
      introduction: $introduction
      talents: $talents
      interests: $interests
    ) {
      ...UserFields
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

export type reloadSkillsResult = {
  getSkillsAnalytic: User;
};
export const reloadSkills = gql`
  ${USER_FIELDS}
  mutation getSkillsAnalytic {
    getSkillsAnalytic {
      ...UserFields
    }
  }
`;
