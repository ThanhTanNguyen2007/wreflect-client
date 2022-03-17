import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Avatar } from 'antd';
import { format } from 'date-fns';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { UserQueries } from '../../grapql-client/queries';
import SearchBar from '../../components/SearchBar/SearchBar';

const UserManagements = () => {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const { data, loading, refetch } = useQuery(UserQueries.getUsers, {
    variables: { isGettingAll: false, search: searchText, page, size },
  });

  useEffect(() => {
    refetch();
  }, [searchText, page, size]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Avatar',
      dataIndex: 'picture',
      key: 'picture',
      render: function UserPicture(picture: string) {
        return <Avatar src={picture} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: function createdAt(createdAt: string) {
        if (!createdAt) return;
        return <>{format(new Date(+createdAt), 'dd MM yyyy')}</>;
      },
    },
  ];
  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
    setPage(1);
  };

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <div className="site-layout-background card-workspace" style={{ padding: 24, height: '100%' }}>
      <>
        <>
          <div className="flex flex-dir-r flex-jc-sb flex-ai-c features-box">
            <div style={{ flex: 10, marginRight: 10 }}>
              <SearchBar placeholder="What are you looking for ?" isLoading={loading} onHandleSearch={onHandleSearch} />
            </div>
            <div style={{ flex: 1 }} className="flex flex-jc-c flex-ai-c">
              <Button style={{ marginRight: 10 }} icon={<UploadOutlined />}>
                Import
              </Button>
              <Button style={{ marginRight: 10 }} icon={<DownloadOutlined />}>
                Export
              </Button>
              <Button>Add Users</Button>
            </div>
          </div>
          <h4 style={{ margin: 20 }} className="flex flex-ai-c flex-jc-c">
            Total {data?.users?.total}
          </h4>
        </>
        <Table dataSource={data?.users?.data} columns={columns} />
        <div className="flex flex-jc-c mt-12" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pagination
            defaultCurrent={1}
            current={page}
            total={data?.users?.total}
            defaultPageSize={8}
            pageSize={size}
            onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
          />
        </div>
      </>
    </div>
  );
};
export default UserManagements;
