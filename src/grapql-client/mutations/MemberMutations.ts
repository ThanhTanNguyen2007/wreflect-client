import { TEAM_FIELDS } from './../fragments/teamFragment';
import { MEMBER_FIELDS } from './../fragments/memberFragment';
import { gql } from '@apollo/client';
import { Member, Team } from '../../types';

export const addMembers = gql`
  mutation addMembers($emailUsers: [String!], $teamId: String!) {
    addMembers(emailUsers: $emailUsers, teamId: $teamId) {
      success
      warnings
      errors
    }
  }
`;

export const removeMember = gql`
  ${TEAM_FIELDS}
  mutation removeMember($memberId: String!, $teamId: String!) {
    removeMember(memberId: $memberId, teamId: $teamId) {
      ...TeamFields
    }
  }
`;

export const changeRoleMember = gql`
  ${TEAM_FIELDS}
  mutation ChangeRoleMember($memberId: String!, $isOwner: Boolean!, $teamId: String!) {
    changeRoleMember(memberId: $memberId, isOwner: $isOwner, teamId: $teamId) {
      ...TeamFields
    }
  }
`;

export type addMembersVars = {
  emailUsers: string[];
  teamId: string;
};
export type removeMemberVars = {
  memberId: string;
  teamId: string;
};

export type changeRoleMemberVars = {
  memberId: string;
  teamId: string;
  isOwner: boolean;
};
export type addMembersResult = {
  addMembers: {
    success: string[];
    warnings: string[];
    errors: string[];
  };
};
export type removeMemberResult = {
  removeMember: Team;
};
export type changeRoleMemberResult = {
  changeRoleMember: Team;
};
