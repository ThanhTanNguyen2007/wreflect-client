import { gql } from '@apollo/client';

export const TEMPLATE_QUESTION_FIELDS = gql`
  fragment TemplateQuestionFields on TemplateQuestion {
    id
    title
    templateId
    color
    description
  }
`;
