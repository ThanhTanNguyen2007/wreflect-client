import { TEMPLATE_FIELDS } from './../fragments/templateFragment';
import { gql, useMutation } from '@apollo/client';
import { Template } from '../../types';

type questionTypes = {
  title: string;
  description: string;
};

export type createTemplateResult = {
  createTemplateHealthCheck: Template;
};
export type createTemplateVars = {
  name: string;
  questions: {
    title: string;
    description: string;
    color: string;
  }[];
};
export const createTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation createTemplateHealthCheck($name: String!, $questions: [questionsInput!]!) {
    createTemplate(name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

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

export type updateTemplateResult = {
  updateTemplateHealthCheck: Template;
};
export type updateTemplateVars = {
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
  mutation updateTemplateHealthCheck($templateId: String!, $name: String!, $questions: [questionsInput!]!) {
    updateTemplate(templateId: $templateId, name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;

export type deleteTemplateRusult = {
  deleteTemplateHealthCheck: Template;
};
export type deleteTemplateVars = {
  templateId: string;
};
export const deleteTemplate = gql`
  ${TEMPLATE_FIELDS}
  mutation deleteTemplateHealthCheck($templateId: String!) {
    deleteTemplate(templateId: $templateId) {
      ...TemplateFields
    }
  }
`;
