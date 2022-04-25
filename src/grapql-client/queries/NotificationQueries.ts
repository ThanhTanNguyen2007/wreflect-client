import { NOTIFICATION_FIELDS } from './../fragments/notificationFragment';
import { gql } from '@apollo/client';
import { Notification } from '../../types';

export type getNotificationResult = {
  getNotifications: Notification[];
};

export type getNotificationVars = {
  offSet: number;
  limit: number;
};

export const getNotifications = gql`
  ${NOTIFICATION_FIELDS}
  query getNotifications($offSet: Int!, $limit: Int!) {
    getNotifications(offSet: $offSet, limit: $limit) {
      ...NotificationFields
    }
  }
`;

export type getNumOfUnSeenNotiResult = {
  getNumOfUnSeenNoti: number;
};

export const getNumOfUnSeenNoti = gql`
  query getNumOfUnSeenNoti {
    getNumOfUnSeenNoti
  }
`;
