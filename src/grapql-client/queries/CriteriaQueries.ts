import { CRITERIA_FIELDS } from './../fragments/criteriaFragment';
import { gql } from '@apollo/client';
import { Criteria } from '../../types';

export type getEssentialResult = {
  getEssential: { criteriaList: Criteria[] };
};

export const getEssential = gql`
  query getEssential {
    getEssential {
      criteriaList {
        id
        name
        description
      }
    }
  }
`;

export type getCriteriaListResult = {
  getCriteriaList: {
    data: Criteria[];
    total;
  };
};

export type getCriteriaListVars = {
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

export const getCriteriaList = gql`
  ${CRITERIA_FIELDS}
  query getCriteriaList($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    getCriteriaList(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...CriteriaFields
      }
      total
    }
  }
`;
