import { convertToActionResult } from './../mutations/OpinionMutations';
import { TEMPLATE_FIELDS } from './../fragments/templateFragment';
import { gql } from '@apollo/client';
import { Template } from '../../types';

export type getTemplatesResult = {
  getTemplates: {
    data: Template[];
    total: number;
  };
};

export type getTemplatesVars = {
  isGettingAll?: boolean;
  search?: string;
  offSet?: number;
  limit?: number;
};

export const getTemplates = gql`
  ${TEMPLATE_FIELDS}
  query getTemplates($isGettingAll: Boolean, $search: String, $offSet: Int, $limit: Int) {
    getTemplates(isGettingAll: $isGettingAll, search: $search, offSet: $offSet, limit: $limit) {
      data {
        ...TemplateFields
      }
      total
    }
  }
`;
