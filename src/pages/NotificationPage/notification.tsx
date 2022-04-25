import React from 'react';
import { NotificationTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Notification } from '../../types';
import { Badge, Button, Modal } from 'antd';
import { useMutation } from '@apollo/client';
import { NotificationMutations } from '../../grapql-client/mutations';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { remove } from 'lodash';
const { confirm } = Modal;

type Props = {
  notification: Notification;
};

export default function NotificationComponent({ notification }: Props) {
  const [seenNotification] = useMutation<
    NotificationMutations.seenNotificationResult,
    NotificationMutations.seenNotificationVars
  >(NotificationMutations?.seenNotification);

  const [removeNotification] = useMutation<
    NotificationMutations.removeNotificationResult,
    NotificationMutations.removeNotificationVars
  >(NotificationMutations?.removeNotification);

  return (
    <div
      onClick={() =>
        seenNotification({
          variables: {
            notificationId: notification?.id,
          },
          optimisticResponse: {
            seenNotification: {
              ...notification,
              isSeen: true,
            },
          },
        })
      }
      className="content flex-1 flex flex-dir-r flex-ai-c flex-jc-sb"
    >
      <div className="flex flex-dir-r flex-ai-c flex-jc-c flex-gap-10">
        <div className="mr-12">
          <Badge dot={!notification?.isSeen}>
            <NotificationTwoTone />
          </Badge>
        </div>
        <div>
          <div className="titleNoti">{notification?.title}</div>
          <div className="descriptionNoti">{notification?.description}</div>
        </div>
      </div>
      <div>
        <Button
          onClick={() =>
            confirm({
              title: 'Do you Want to delete these items?',
              icon: <ExclamationCircleOutlined />,
              content: 'Some descriptions',
              centered: true,
              onOk() {
                removeNotification({
                  variables: {
                    notificationId: notification?.id,
                  },
                  //   updateQuery: (previousResult, { fetchMoreResult }) => {
                  //     [...previousResult?.getNotifications, ...fetchMoreResult?.getNotifications];
                  //     return {
                  //       getNotifications: [...previousResult?.getNotifications, ...fetchMoreResult?.getNotifications],
                  //     };
                  //   },
                  updateQueries: {
                    getNotifications: (prev, { mutationResult }) => {
                      return {
                        getNotifications: prev?.getNotifications?.filter(
                          (x: Notification) => x?.id !== mutationResult?.data?.removeNotification?.id,
                        ),
                      };
                    },
                  },
                });
              },
            })
          }
          type="text"
          icon={<CloseCircleTwoTone />}
          className="removeNoti"
        />
      </div>
    </div>
  );
}
