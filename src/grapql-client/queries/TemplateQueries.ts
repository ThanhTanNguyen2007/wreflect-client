import { TEAM_FIELDS } from './../fragments/teamFragment';
import { convertToActionResult } from './../mutations/OpinionMutations';
import { TEMPLATE_FIELDS } from './../fragments/templateFragment';
import { gql } from '@apollo/client';
import { Template } from '../../types';

export type getTemplatesOfTeamResult = {
  getTemplatesOfTeam: Template[];
};
export type getTemplatesOfTeamVars = {
  teamId: string;
};
export const getTemplatesOfTeam = gql`
  ${TEMPLATE_FIELDS}
  query getTemplatesOfTeam($teamId: String!) {
    getTemplatesOfTeam(teamId: $teamId) {
      ...TemplateFields
    }
  }
`;

export type getTemplatesResult = {
  getTemplates: {
    data: Template[];
    total: number;
  };
};
export type getTemplatesVars = {
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};
export const getTemplates = gql`
  ${TEMPLATE_FIELDS}
  query getTemplates($isGettingAll: Boolean, $search: String, $page: Int, $size: Int) {
    getTemplates(isGettingAll: $isGettingAll, search: $search, page: $page, size: $size) {
      data {
        ...TemplateFields
      }
      total
    }
  }
`;
