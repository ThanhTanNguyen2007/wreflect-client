import { gql } from '@apollo/client';
import { Criteria } from '../../types';

export type getListCriteria = {
  criteriaList: Criteria[];
};

export const getListCriteria = gql`
  query CriteriaList {
    criteriaList {
      id
      name
      description
    }
  }
`;
