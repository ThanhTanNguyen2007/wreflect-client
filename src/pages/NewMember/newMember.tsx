import React from 'react';
import { Form, Input, Button, Layout } from 'antd';

import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { getUsers } from '../../grapql-client/queries/UserQueries';

const { Content } = Layout;
const { TextArea } = Input;

const newMember = () => {
  const { loading, error, data } = useQuery(getUsers);

  return (
    <div>
      <Layout
        style={{ minHeight: '80vh', overflow: 'hidden', marginTop: 60, position: 'relative', alignItems: 'center' }}
      >
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            border: '1px solid white',
            borderRadius: '20px 30px',
            boxShadow: '5px 10px #d1d1d1',
          }}
        >
          <Form>
            <h2 style={{ textAlign: 'center' }}>Profile</h2>
            <Form.Item name="Name" label="Name">
              <TextArea
                style={{ width: '500px', marginLeft: '53px', height: '30px' }}
              />
            </Form.Item>
            <Button type="primary" style={{ margin: '20px 0px 0px 45%', width: '80px', height: '40px' }}>
              Save
            </Button>
          </Form>
        </Content>
      </Layout>
    </div>
  );
};

export { newMember };
