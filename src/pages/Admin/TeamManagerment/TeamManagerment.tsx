import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { UnlockOutlined, LockOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, PageHeader, Pagination, Table } from 'antd';

import { Team, User } from '../../../types';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { TeamQueries, UserQueries } from '../../../grapql-client/queries';
import { getUsersResult, getUsersVars } from '../../../grapql-client/queries/UserQueries';
import { TeamMutations } from '../../../grapql-client/mutations';
import { getTeamsResult, getTeamsVars } from '../../../grapql-client/queries/TeamQueries';
import { Link } from 'react-router-dom';

type Props = {
  isAdmin: boolean;
};

export default function TeamManagerment({ isAdmin }: Props) {
  const [selectedUser, setSelectedUser] = useState<User>();
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data: teams, loading: isGettingTeams } = useQuery<getTeamsResult, getTeamsVars>(TeamQueries?.getTeams, {
    variables: {
      isGettingAll: false,
      page,
      size,
      search: searchText,
      status: 'ALL',
    },
  });

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
      title: 'Picture',
      dataIndex: 'picture',
      key: 'picture',
      width: 100,
      render: function UserPicture(picture: string) {
        return <Avatar src={picture} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render(value, row) {
        return (
          <div>
            <Link to={`/reflect/${row?.id}/${row?.boards[0]?.id}`}>{value}</Link>
          </div>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'name',
      render(value) {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Number Of Members',
      key: 'numberOfMembers',
      width: 200,
      render(value, row) {
        return <div>{row?.members?.length}</div>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render(value, row) {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Owner',
      key: 'owner',
      render(value, row: Team) {
        const user = row?.members?.find((member) => member?.isSuperOwner)?.user;
        return (
          <div>
            {/* {row?.members?.find((member) => member?.isSuperOwner).user?.email} */}
            <Link to={`/profile/${user?.id}`}>{user?.email}</Link>
          </div>
        );
      },
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   width: 100,
    //   render(value, row: User) {
    //     return (
    //       <>
    //         <Button
    //           type="primary"
    //           danger={row?.banningUser?.id ? true : false}
    //           icon={<>{row?.banningUser?.id ? <UnlockOutlined /> : <LockOutlined />}</>}
    //           onClick={() => setSelectedUser(row)}
    //           title="Ban"
    //         >
    //           Ban
    //         </Button>
    //       </>
    //     );
    //   },
    // },
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
    <div className="teamManagermentPage non-scroll flex flex-1">
      <PageHeader className="site-page-header flex flex-ai-c flex-jc-c" title="Team Managerment" />
      <div className="flex flex-1 flex-dir-c non-scroll">
        <Card className="listItem highligh flex flex-1 width-100 non-scroll">
          <>
            <>
              <div className="flex mb-10  flex-dir-r flex-jc-sb flex-ai-c flex-gap-24">
                <div className="bold">(Total: {teams?.getTeams?.total})</div>
                <div>
                  <SearchBar
                    placeholder="What are you looking for ?"
                    isLoading={isGettingTeams}
                    onHandleSearch={onHandleSearch}
                  />
                </div>
                <Pagination
                  size="default"
                  defaultCurrent={1}
                  current={page}
                  total={teams?.getTeams?.total}
                  pageSize={size}
                  onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
                />
              </div>
              <Divider style={{ marginBottom: 0 }} />
              <div className="flex p-10 flex-1 flex-gap-10 scrollable">
                <Table
                  className="scrollable"
                  loading={isGettingTeams}
                  columns={columns}
                  dataSource={teams?.getTeams?.data}
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
