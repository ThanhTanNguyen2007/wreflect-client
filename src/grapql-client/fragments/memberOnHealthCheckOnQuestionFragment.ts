import { TEMPLATE_QUESTION_FIELDS } from './templateQuestionFragment';
import { MEMBER_FIELDS } from './memberFragment';
import { gql } from '@apollo/client';

export const MEMBER_ON_HEALTH_CHECK_ON_QUESTION_FIELDS = gql`
  ${MEMBER_FIELDS}
  ${TEMPLATE_QUESTION_FIELDS}
  fragment MemberOnHealthCheckOnQuestionFields on MemberOnHealthCheckOnQuestion {
    id
    healthCheckId
    questionId
    memberId
    point
    comment
    member {
      ...MemberFields
    }
    question {
      ...TemplateQuestionFields
    }
  }
`;
