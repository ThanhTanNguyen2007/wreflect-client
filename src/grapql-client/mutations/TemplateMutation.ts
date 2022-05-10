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
  mutation createTemplateHealthCheck($name: String!, $questions: [questionsInput!]) {
    createTemplateHealthCheck(name: $name, questions: $questions) {
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
  mutation updateTemplateHealthCheck($templateId: String!, $name: String!, $questions: [questionsInput!]) {
    updateTemplateHealthCheck(templateId: $templateId, name: $name, questions: $questions) {
      ...TemplateFields
    }
  }
`;
