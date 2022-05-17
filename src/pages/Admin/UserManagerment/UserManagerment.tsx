import React, { useState } from 'react';
import { Table, Pagination, Button, Avatar, PageHeader, Card, Divider, Empty, notification } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { UserQueries } from '../../../grapql-client/queries';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { getUsersResult, getUsersVars } from '../../../grapql-client/queries/UserQueries';
import moment from 'moment';
import { User } from '../../../types';
import BanUserModal from './BanUserModal';

type Props = {
  isAdmin: boolean;
};

export default function UserManagementPage({ isAdmin }: Props) {
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const { data: users, loading: isGetting } = useQuery<getUsersResult, getUsersVars>(UserQueries?.getUsers, {
    variables: {
      search: searchText,
      page,
      size,
    },
    fetchPolicy: 'network-only',
  });

  console.log('users', users);

  const columns = [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: function createdAt(createdAt: string) {
        // return <>{format(new Date(+createdAt), 'dd MM yyyy')}</>;
        return <>{moment(+createdAt).format('DD/MM/YYYY')}</>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'userStatus',
      key: 'email',
      width: 150,
      render(value: string) {
        return (
          <div className="flex flex-dir-r flex-gap-10 flex-ai-c">
            <div className={`dot ${value.toLowerCase() == 'online' ? 'green' : 'red'}`} />
            <div>{value.toLowerCase()}</div>
          </div>
        );
      },
    },
    {
      title: 'Avatar',
      dataIndex: 'picture',
      key: 'picture',
      width: 100,
      render: function UserPicture(picture: string) {
        return <Avatar src={picture} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'nickname',
      key: 'name',
      render(value) {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render(value, row: User) {
        return (
          <>
            <Button
              type="primary"
              danger={row?.banningUser?.id ? true : false}
              icon={<>{row?.banningUser?.id ? <UnlockOutlined /> : <LockOutlined />}</>}
              onClick={() => setSelectedUser(row)}
              title="Ban"
            >
              Ban
            </Button>
          </>
        );
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
    <div className="userManagementPage flex flex-1">
      <BanUserModal user={selectedUser} setUser={setSelectedUser} />
      <PageHeader className="site-page-header flex flex-ai-c flex-jc-c" title="User Managerment" />
      <div className="flex flex-1 flex-dir-c">
        <Card className="listItem highligh flex flex-1 width-100 non-scroll">
          <>
            <>
              <div className="flex mb-10  flex-dir-r flex-jc-sb flex-ai-c flex-gap-24">
                <div className="bold">(Total: {users?.getUsers?.total})</div>
                <div>
                  <SearchBar
                    placeholder="What are you looking for ?"
                    isLoading={isGetting}
                    onHandleSearch={onHandleSearch}
                  />
                </div>
                <Pagination
                  size="default"
                  defaultCurrent={1}
                  current={page}
                  total={users?.getUsers?.total}
                  pageSize={size}
                  onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
                />
              </div>
              <Divider style={{ marginBottom: 0 }} />
              <div className="flex p-10 flex-1 flex-gap-10 non-scroll">
                <Table
                  className="scrollable"
                  loading={isGetting}
                  columns={columns}
                  dataSource={users?.getUsers?.data}
                  sticky
                  pagination={false}
                />
              </div>
            </>
          </>
        </Card>
      </div>
    </div>
  );
}
