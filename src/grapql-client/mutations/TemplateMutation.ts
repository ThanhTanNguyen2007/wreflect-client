import { TEMPLATE_FIELDS } from './../fragments/templateFragment';
import { gql } from '@apollo/client';
import { Template } from '../../types';

type questionTypes = {
  title: string;
  description: string;
};

export type createTemplateHealthCheckResult = {
  createTemplateHealthCheck: Template;
};
export type createTemplateHealthCheckVars = {
  name: string;
  questions: {
    title: string;
    description: string;
    color: string;
  }[];
};
export const createTemplateHealthCheck = gql`
  ${TEMPLATE_FIELDS}
  mutation createTemplateHealthCheck($name: String!, $questions: [questionsInput!]!) {
    createTemplateHealthCheck(name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type createCustomTemplateForTeamResult = {
  createCustomTemplateForTeam: Template;
};
export type createCustomTemplateForTeamVars = {
  teamId: string;
  name: string;
  questions: {
    title: string;
    description: string;
    color: string;
  }[];
};
export const createCustomTemplateForTeam = gql`
  ${TEMPLATE_FIELDS}
  mutation createCustomTemplateForTeam($teamId: String!, $name: String!, $questions: [questionsInput!]!) {
    createCustomTemplateForTeam(teamId: $teamId, name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type updateTemplateHealthCheckResult = {
  updateTemplateHealthCheck: Template;
};
export type updateTemplateHealthCheckVars = {
  templateId: string;
  name: string;
  questions: {
    id: string;
    title: string;
    description: string;
  }[];
};
export const updateTemplateHealthCheck = gql`
  ${TEMPLATE_FIELDS}
  mutation updateTemplateHealthCheck($templateId: String!, $name: String!, $questions: [questionsInput!]!) {
    updateTemplateHealthCheck(templateId: $templateId, name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type deleteTemplateHealthCheckResult = {
  deleteTemplateHealthCheck: Template;
};
export type deleteTemplateHealthCheckVars = {
  templateId: string;
};
export const deleteTemplateHealthCheck = gql`
  ${TEMPLATE_FIELDS}
  mutation deleteTemplateHealthCheck($templateId: String!) {
    deleteTemplateHealthCheck(templateId: $templateId) {
      ...TemplateFields
    }
  }
`;
