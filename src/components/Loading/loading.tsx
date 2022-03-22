import React from 'react';
import { Spin, Result, Button } from 'antd';

type Props = {
  children: JSX.Element;
  data: any;
  refetch: () => void;
  loading: boolean;
  error: any;
};

export default function loading({ children, refetch, loading, error }: Props) {
  console.log('error', error);
  return (
    <>
      {loading || error ? (
        <div className="flex flex-1 flex-ai-c flex-jc-c card">
          {loading ? (
            <Spin size="large" tip="Loading..." />
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
