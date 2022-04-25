import { ANSWER_ON_CRITERIA_FIELDS } from './answerOnCriteriaFragment';
import { MEMBER_FIELDS } from './memberFragment';
import { gql } from '@apollo/client';
export const RESULT_FIELDS = gql`
  ${MEMBER_FIELDS}
  ${ANSWER_ON_CRITERIA_FIELDS}
  fragment ResultFields on Result {
    id
    concerningMemberId
    evaluationId
    answerOnCriteriaList {
      ...AnswerOnCriteriaFields
    }
    concerningMember {
      ...MemberFields
    }
  }
`;
