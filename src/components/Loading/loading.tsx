import React from 'react';
import { Spin, Result, Button } from 'antd';

type Props = {
  children: JSX.Element;
  data: any;
  loading: boolean;
  error?: any;
};

export default function loading({ children, loading, error }: Props) {
  return (
    <>
      {loading ? (
        <div className="flex flex-1 flex-ai-c flex-jc-c">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <>
          {error ? (
            <Result
              status={error?.graphQLErrors[0]?.extensions?.code}
              title={error?.graphQLErrors[0]?.extensions?.code}
              subTitle={error?.message}
            />
          ) : (
            children
          )}
        </>
      )}
    </>
  );
}
