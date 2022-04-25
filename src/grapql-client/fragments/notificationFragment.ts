import { USER_FIELDS } from './userFragment';
import { gql } from '@apollo/client';

export const NOTIFICATION_FIELDS = gql`
  fragment NotificationFields on Notification {
    id
    receiverId
    senderId
    title
    description
    isSeen
    createdAt
  }
`;
