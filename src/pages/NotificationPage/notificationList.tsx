import { useQuery } from '@apollo/client';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { NotificationQueries } from '../../grapql-client/queries';
import NotificationComponent from './notification';

export default function NotificationPage() {
  const [offSet, setOffSet] = useState(0);
  const [limit, setLimit] = useState(10);

  const {
    data: notificationData,
    fetchMore,
    loading,
  } = useQuery<NotificationQueries.getNotificationResult, NotificationQueries.getNotificationVars>(
    NotificationQueries?.getNotifications,
    {
      variables: {
        offSet: 0,
        limit: 10,
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
                      offSet: offSet + limit,
                      limit,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      [...previousResult?.getNotifications, ...fetchMoreResult?.getNotifications];
                      return {
                        getNotifications: [...previousResult?.getNotifications, ...fetchMoreResult?.getNotifications],
                      };
                    },
                  });
                  setOffSet(offSet + limit);
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
