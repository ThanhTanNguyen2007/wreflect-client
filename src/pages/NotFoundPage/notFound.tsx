import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function notFound() {
  const history = useHistory();

  return (
    <div className="flex flex-1 flex-ai-c flex-jc-c">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            onClick={() => {
              history.replace('/teams');
            }}
            type="primary"
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
}
