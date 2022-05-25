import { TEMPLATE_FIELDS } from './../fragments/templateFragment';
import { gql, useMutation } from '@apollo/client';
import { Template } from '../../types';

export type createCustomTemplateResult = {
  createCustomTemplate: Template;
};
export type createCustomTemplateVars = {
  teamId: string;
  name: string;
  questions: {
    title: string;
    description: string;
    color: string;
  }[];
};
export const createCustomTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation createCustomTemplate($teamId: String!, $name: String!, $questions: [questionsInput!]!) {
    createCustomTemplate(teamId: $teamId, name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type updateCustomTemplateResult = {
  updateCustomTemplate: Template;
};
export type updateCustomTemplateVars = {
  teamId: string;
  templateId: string;
  name: string;
  questions: {
    id: string;
    title: string;
    description: string;
    color: string;
  };
};
export const updateCustomTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation updateCustomTemplate(
    $teamId: String!
    $templateId: String!
    $name: String!
    $questions: [questionsWithIdInput!]!
  ) {
    updateCustomTemplate(teamId: $teamId, templateId: $templateId, name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type deleteCustomTemplateResult = {
  deleteCustomTemplate: Template;
};
export type deleteCustomTemplateVars = {
  teamId: string;
  templateId: string;
};
export const deleteCustomTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation deleteCustomTemplate($teamId: String!, $templateId: String!) {
    deleteCustomTemplate(teamId: $teamId, templateId: $templateId) {
      ...TemplateFields
    }
  }
`;

export type createHealthCheckTemplateResult = {
  createHealthCheckTemplate: Template;
};
export type createHealthCheckTemplateVars = {
  name: string;
  questions: {
    title: string;
    description: string;
    color: string;
  }[];
};
export const createHealthCheckTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation createHealthCheckTemplate($name: String!, $questions: [questionsInput!]!) {
    createHealthCheckTemplate(name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type updateHealthCheckTemplateResult = {
  updateTemplateHealthCheck: Template;
};
export type updateHealthCheckTemplateVars = {
  templateId: string;
  name: string;
  questions: {
    id: string;
    title: string;
    description: string;
  }[];
};
export const updateTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation updateHealthCheckTemplate($templateId: String!, $name: String!, $questions: [questionsInput!]!) {
    updateHealthCheckTemplate(templateId: $templateId, name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type deleteHealthCheckTemplateRusult = {
  deleteTemplateHealthCheck: Template;
};
export type deleteHealthCheckTemplateVars = {
  templateId: string;
};
export const deleteTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation deleteHealthCheckTemplate($templateId: String!) {
    deleteHealthCheckTemplate(templateId: $templateId) {
      ...TemplateFields
    }
  }
`;
