import { gql } from '@apollo/client';
import { Criteria } from '../../types';

export type getEssentialDataResult = {
  getEssentialData: {
    criteriaList: Criteria[];
  };
};

export const getEssentialData = gql`
  query getEssentialData {
    getEssentialData {
      criteriaList {
        id
        name
        description
      }
    }
  }
`;
