import { USER_ON_CRITERIA_FIELDS } from './userOnCriteriaFragment';
import { NOTIFICATION_FIELDS } from './notificationFragment';
import { gql } from '@apollo/client';
import { SESSION_FIELDS } from './sessionFragment';
export const USER_FIELDS = gql`
  ${NOTIFICATION_FIELDS}
  ${USER_ON_CRITERIA_FIELDS}
  ${SESSION_FIELDS}
  fragment UserFields on User {
    id
    email
    createdAt
    updatedAt
    isAdmin
    userStatus
    nickname
    picture
    workplace
    address
    school
    introduction
    talent
    interest
    gender
    notifications {
      ...NotificationFields
    }
    skillValues {
      ...UserOnCriteriaFields
    }
    sessions {
      ...SessionFields
    }
  }
`;
