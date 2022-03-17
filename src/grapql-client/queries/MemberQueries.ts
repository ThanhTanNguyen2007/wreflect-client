import { gql } from '@apollo/client';

export type getListMembersVars = {
  teamId: string;
};

const getListMembers = gql`
  query getListMembers($teamId: String!) {
    members(teamId: $teamId) {
      id
      userId
      teamId
      isOwner
      isPendingInvitation
      isGuess
      invitedBy
      joinedAt
      user {
        id
        email
        createdAt
        updatedAt
        isAdmin
        userStatus
      }
    }
  }
`;

export { getListMembers };
