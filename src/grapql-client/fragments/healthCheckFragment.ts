import { gql } from '@apollo/client';
import { MEMBER_ON_HEALTH_CHECK_ON_QUESTION_FIELDS } from './memberOnHealthCheckOnQuestionFragment';
export const HEALTH_CHECK_FIELDS = gql`
  ${MEMBER_ON_HEALTH_CHECK_ON_QUESTION_FIELDS}
  fragment HealthCheckFields on HealthCheck {
    id
    teamId
    boardId
    templateId
    createdAt
    createdBy
    updatedAt
    updatedBy
    isAnonymous
    memberOnHealthCheck {
      ...MemberOnHealthCheckOnQuestionFields
    }
  }
`;
