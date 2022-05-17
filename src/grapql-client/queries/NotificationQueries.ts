import { NOTIFICATION_FIELDS } from './../fragments/notificationFragment';
import { gql } from '@apollo/client';
import { Notification } from '../../types';

export type getNotificationResult = {
  getNotifications: Notification[];
};

export type getNotificationVars = {
  page: number;
  size: number;
};

export const getNotifications = gql`
  ${NOTIFICATION_FIELDS}
  query getNotifications($page: Int!, $size: Int!) {
    getNotifications(page: $page, size: $size) {
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
