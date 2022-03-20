import React, { useContext, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { Member, Team, User } from '../../types';
import { useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { Table, Avatar } from 'antd';
import SelfContext from '../../contexts/selfContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import moment from 'moment';

export default function OwnedTeams() {
  const [searchText, setSearchText] = useState('');
  const me = useContext(SelfContext);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [isAscSort, setIsAscSort] = useState(false);

  const columns: ColumnsType<Team> = [
    {
      title: 'Picture',
      dataIndex: 'picture',
      key: 'picture',
      align: 'center',
      width: '10%',
      render(value) {
        return <Avatar src={value} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '20%',
    },
    {
      title: 'Role',
      dataIndex: 'members',
      key: 'name',
      align: 'center',
      filters: [
        {
          text: 'Super Owner',
          value: 'SUPER_OWNER',
        },
        {
          text: 'Owner',
          value: 'OWNER',
        },
        {
          text: 'Member',
          value: 'MEMBER',
        },
      ],
      onFilter: (value, record) =>
        (record.members.find((member) => member.userId === me.id).isOwner ? 'OWNER' : 'MEMBER') === value,
      render(members: Member[]) {
        return members.find((member) => member.userId === me.id).isOwner ? 'Owner' : 'Member';
      },
    },
    {
      title: 'Team Contact Email',
      dataIndex: 'owner',
      key: 'owner',
      align: 'center',
      render(owner: User) {
        return `${owner?.email}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        {
          text: 'DOING',
          value: 'DOING',
        },
        {
          text: 'DONE',
          value: 'DONE',
        },
      ],
      onFilter: (value, record) => record.status.startsWith(value as string),
      render(status: string) {
        return <div style={status === 'DONE' ? { color: 'green' } : undefined}>{status}</div>;
      },
    },
    {
      title: 'Public/Private',
      dataIndex: 'isPublic',
      key: 'public_private',
      align: 'center',
      filters: [
        {
          text: 'Public',
          value: 'public',
        },
        {
          text: 'Private',
          value: 'private',
        },
      ],
      onFilter: (value, record) => value === (record.isPublic ? 'public' : 'private'),
      render(isPublic: boolean) {
        return isPublic ? 'Public' : 'Private';
      },
    },
    {
      title: 'Joined',
      dataIndex: 'members',
      key: 'joined',
      align: 'center',
      sorter: (a, b) =>
        +a.members.find((member) => member.userId === me.id).joinedAt -
        +b.members.find((member) => member.userId === me.id).joinedAt,
      render(members: Member[]) {
        return moment(new Date(+members.find((member) => member.userId === me.id).joinedAt)).format('DD/MM/YYYY');
      },
    },
  ];

  const { data, loading } = useQuery<TeamQueries.getOwnedTeamsResult, TeamQueries.getOwnedTeamsVars>(
    TeamQueries.getOwnedTeams,
    {
      variables: {
        isGettingAll: false,
        page: page,
        size: size,
        search: searchText,
      },
    },
  );

  const onPaginationChanged = (page: number, pageSize?: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
    setPage(1);
  };

  return (
    <>
      <SearchBar
        style={{ marginBottom: '10px' }}
        placeholder="Searching your teams..."
        isLoading={loading}
        onHandleSearch={onHandleSearch}
      />

      <Table
        columns={columns}
        dataSource={data?.getOwnedTeams?.data}
        bordered
        pagination={{
          defaultCurrent: 1,
          current: page,
          total: data?.getOwnedTeams?.total,
          showSizeChanger: true,
          defaultPageSize: 4,
          pageSize: size,
          onChange: (page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize),
        }}
      />
    </>
  );
}
