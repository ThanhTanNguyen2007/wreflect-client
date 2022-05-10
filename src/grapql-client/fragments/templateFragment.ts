import { gql } from '@apollo/client';
import { TEMPLATE_QUESTION_FIELDS } from './templateQuestionFragment';

export const TEMPLATE_FIELDS = gql`
  ${TEMPLATE_QUESTION_FIELDS}
  fragment TemplateFields on Template {
    id
    title
    isDefault
    createdAt
    updatedAt
    teamId
    healthCheckQuestions {
      ...TemplateQuestionFields
    }
  }
`;
