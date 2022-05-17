import { Criteria } from './../../types';
import { CRITERIA_FIELDS } from './../fragments/criteriaFragment';
import { gql } from '@apollo/client';

export type createCriteriaResult = {
  createCriteria: Criteria;
};
export type createCriteriaVars = {
  name: string;
  description: string;
};
export const createCriteria = gql`
  ${CRITERIA_FIELDS}
  mutation createCriteria($name: String!, $description: String!) {
    createCriteria(name: $name, description: $description) {
      ...CriteriaFields
    }
  }
`;

export type updateCriteriaResult = {
  updateCriteria: Criteria;
};
export type updateCriteriaVars = {
  criteriaId: string;
  name: string;
  description: string;
};
export const updateCriteria = gql`
  ${CRITERIA_FIELDS}
  mutation updateCriteria($criteriaId: String!, $name: String!, $description: String!) {
    updateCriteria(criteriaId: $criteriaId, name: $name, description: $description) {
      ...CriteriaFields
    }
  }
`;

export type deleteCriteriaResult = {
  deleteCriteria: Criteria;
};
export type deleteCriteriaVars = {
  criteriaId: string;
};
export const deleteCriteria = gql`
  ${CRITERIA_FIELDS}
  mutation deleteCriteria($criteriaId: String!) {
    deleteCriteria(criteriaId: $criteriaId) {
      ...CriteriaFields
    }
  }
`;
