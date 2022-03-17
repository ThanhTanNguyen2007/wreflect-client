import { gql } from '@apollo/client';

export type updateTeamsResult = {
  updateListTeams: {
    success: boolean;
  };
};

export type updateTeamsVars = {
  meId: string;
};

export const updateTeams = gql`
  subscription Teams($meId: ID!) {
    updateListTeams(meId: $meId) {
      success
    }
  }
`;
