import { gql } from '@apollo/client';
import { Member } from '../../types';

const addMembers = gql`
  mutation addMembers($emailUsers: [String!], $teamId: String!) {
    addMembers(emailUsers: $emailUsers, teamId: $teamId) {
      success
      warnings
      errors
    }
  }
`;

const removeMember = gql`
  mutation removeMember($memberId: String!) {
    removeMember(memberId: $memberId) {
      count
    }
  }
`;

const changeRoleMember = gql`
  mutation ChangeRoleMember($memberId: String!, $isOwner: Boolean!, $teamId: String!) {
    changeRoleMember(memberId: $memberId, isOwner: $isOwner, teamId: $teamId) {
      id
      teamId
      userId
      isOwner
      isPendingInvitation
      isGuess
      invitedBy
      joinedAt
      role
    }
  }
`;

export type addMembersVars = {
  emailUsers: string[];
  teamId: string;
};
export type removeMemberVars = {
  memberId: string;
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
  removeMember: {
    count: number;
  };
};
export type changeRoleMemberResult = {
  changeRoleMember: Member;
};

export { addMembers as addMembers, removeMember, changeRoleMember };
