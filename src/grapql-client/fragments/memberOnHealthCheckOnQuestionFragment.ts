import { gql } from '@apollo/client';

export const MEMBER_ON_HEALTH_CHECK_ON_QUESTION_FIELDS = gql`
  fragment MemberOnHealthCheckOnQuestionFields on MemberOnHealthCheckOnQuestion {
    id
    healthCheckId
    questionId
    memberId
    point
    comment
  }
`;
