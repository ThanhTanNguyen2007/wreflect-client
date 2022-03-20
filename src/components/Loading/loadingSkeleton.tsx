import React from 'react';
import { Spin, Result, Button, Skeleton } from 'antd';

type Props = {
  children: JSX.Element;
  data: any;
  refetch: () => void;
  loading: boolean;
  error: any;
};

export default function LoadingSkeleton({ children, refetch, loading, error }: Props) {
  return (
    <>
      {loading || error ? (
        <div className="flex flex-1 flex-ai-c flex-jc-c card">
          {loading ? (
            <Skeleton active/>
          ) : (
            <>
              <Result
                status={error?.graphQLErrors[0]?.extensions?.code}
                title={error?.graphQLErrors[0]?.extensions?.code}
                subTitle={error?.message}
                extra={
                  <Button
                    type="primary"
                    key="console"
                    onClick={() => {
                      refetch();
                    }}
                  >
                    Reload
                  </Button>
                }
              />
            </>
          )}
        </div>
      ) : (
        children
      )}
    </>
  );
}
