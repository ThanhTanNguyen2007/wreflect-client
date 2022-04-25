import { NOTIFICATION_FIELDS } from './../fragments/notificationFragment';
import { gql } from '@apollo/client';
import { Notification } from '../../types';

export type seenNotificationResult = {
  seenNotification: Notification;
};

export type seenNotificationVars = {
  notificationId: string;
};

export const seenNotification = gql`
  ${NOTIFICATION_FIELDS}
  mutation seenNotification($notificationId: String!) {
    seenNotification(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
`;

export type removeNotificationResult = {
  removeNotification: Notification;
};

export type removeNotificationVars = {
  notificationId: string;
};

export const removeNotification = gql`
  ${NOTIFICATION_FIELDS}
  mutation removeNotification($notificationId: String!) {
    removeNotification(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
`;
