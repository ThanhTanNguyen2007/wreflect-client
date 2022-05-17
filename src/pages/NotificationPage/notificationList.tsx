import { useQuery } from '@apollo/client';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { NotificationQueries } from '../../grapql-client/queries';
import NotificationComponent from './notification';

export default function NotificationPage() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const {
    data: notificationData,
    fetchMore,
    loading,
  } = useQuery<NotificationQueries.getNotificationResult, NotificationQueries.getNotificationVars>(
    NotificationQueries?.getNotifications,
    {
      variables: {
        page,
        size,
      },
    },
  );

  // useEffect(() => {

  // }, [])

  return (
    <>
      <div className="notificationPage">
        <div className="headerSection">Notification(s)</div>
        <div className="container">
          <>
            {notificationData?.getNotifications?.map((notification) => (
              <>
                <NotificationComponent notification={notification} />
              </>
            ))}
            <div className="mt-25">
              <Button
                loading={loading}
                onClick={async () => {
                  await fetchMore({
                    variables: {
                      page,
                      size,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      [...previousResult?.getNotifications, ...fetchMoreResult?.getNotifications];
                      return {
                        getNotifications: [...previousResult?.getNotifications, ...fetchMoreResult?.getNotifications],
                      };
                    },
                  });
                  setPage(page + 1);
                }}
              >
                Load more
              </Button>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
