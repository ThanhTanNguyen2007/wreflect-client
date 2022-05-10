import { gql } from '@apollo/client';
import { MEMBER_ON_HEALTH_CHECK_ON_QUESTION_FIELDS } from './memberOnHealthCheckOnQuestionFragment';

export const TEMPLATE_QUESTION_FIELDS = gql`
  ${MEMBER_ON_HEALTH_CHECK_ON_QUESTION_FIELDS}
  fragment TemplateQuestionFields on TemplateQuestion {
    id
    title
    templateId
    color
    description
    memberOnHealthCheck {
      ...MemberOnHealthCheckOnQuestionFields
    }
  }
`;
