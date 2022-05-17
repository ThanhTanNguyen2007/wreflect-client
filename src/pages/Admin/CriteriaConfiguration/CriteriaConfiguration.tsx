import React, { useRef, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Modal, Table, Card, Empty, PageHeader, Pagination, Tooltip, notification, Divider } from 'antd';

import { Criteria } from '../../../types';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { CriteriaQueries } from '../../../grapql-client/queries';
import Loading from '../../../components/Loading/loading';
import { CriteriaMutations } from '../../../grapql-client/mutations';
import { getCriteriaListResult, getCriteriaListVars } from '../../../grapql-client/queries/CriteriaQueries';
import { deleteCriteriaResult, deleteCriteriaVars } from '../../../grapql-client/mutations/CriteriaMutations';
import { EditOutlined, DeleteOutlined, WarningTwoTone } from '@ant-design/icons';
import EditCriteriaModal from './EditCriteriaModal';
import CreateCriteriaModal from './CreateCriteriaModal';

type Props = {
  isAdmin: boolean;
};
const { confirm } = Modal;

export default function CriteriaConfiguration({ isAdmin }: Props) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isCreateCriteriaVisible, setIsCreateCriteriaVisible] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria>();
  const history = useHistory();

  const { data: criteriaList } = useQuery<getCriteriaListResult, getCriteriaListVars>(
    CriteriaQueries?.getCriteriaList,
    {
      variables: {
        search: searchText,
        page,
        size,
      },
      fetchPolicy: 'network-only',
    },
  );
  const [deleteCriteria, { loading: isDeleting }] = useMutation<deleteCriteriaResult, deleteCriteriaVars>(
    CriteriaMutations?.deleteCriteria,
    {
      onError: (error) => {
        notification?.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
      onCompleted: () => {
        notification.success({
          placement: 'bottomRight',
          message: `Delete Criteria Success`,
        });
      },
      refetchQueries: ['getCriteriaList'],
    },
  );

  const columns: ColumnsType<Criteria> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: function CreatedAt(createdAt) {
        return <>{moment(+createdAt).format('DD/MM/YYYY hh:mm')}</>;
      },
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: function UpdatedAt(updatedAt) {
        return <>{moment(+updatedAt).format('DD/MM/YYYY hh:mm')}</>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'description',
      width: '20%',
      align: 'center',
      render: function Test(value, row: Criteria) {
        return (
          <>
            <div className="flex flex-dir-r flex-wrap flex-gap-10">
              <Button onClick={() => setSelectedCriteria(row)} type="primary" icon={<EditOutlined />} title={'Edit'}>
                Edit
              </Button>
              <Button
                onClick={async () =>
                  confirm({
                    title: 'Are you sure want to delete this criteria?',
                    icon: <WarningTwoTone twoToneColor="red" />,
                    content: 'Deleting this criteria may effect to other data',
                    okType: 'danger',
                    okText: 'Delete',
                    okButtonProps: { type: 'primary' },
                    onOk: async () => {
                      await deleteCriteria({
                        variables: {
                          criteriaId: row?.id,
                        },
                      });
                    },
                  })
                }
                loading={isDeleting}
                danger
                icon={<DeleteOutlined />}
                title={'Delete'}
              >
                Delete
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  // useLayoutEffect(() => {
  //   const node = ref?.current;
  //   const { top } = node?.getBoundingClientRect();

  //   // normally TABLE_HEADER_HEIGHT would be 55.
  //   setTableHeight(window?.innerHeight - top - 55);
  // }, [ref]);

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
  };
  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <div className="criteriaConfiguration non-scroll p-10 flex flex-1">
      {page > 1 && criteriaList?.getCriteriaList?.data?.length == 0 && setPage(page - 1)}
      <CreateCriteriaModal isVisible={isCreateCriteriaVisible} setIsVisible={setIsCreateCriteriaVisible} />
      <EditCriteriaModal criteria={selectedCriteria} setCriteria={setSelectedCriteria} />
      <PageHeader
        className="site-page-header mb-10"
        extra={
          <>
            <div className="action flex flex-dir-r flex-gap-10">
              <div className="filterBox flex flex-1 flex-dir-c">
                <SearchBar placeholder="What are you looking for ?" isLoading={false} onHandleSearch={onHandleSearch} />
              </div>
              <Button type="primary" onClick={() => setIsCreateCriteriaVisible(true)}>
                Create
              </Button>
            </div>
          </>
        }
        onBack={() => history.push('/admin/system-configuration')}
        title="Criteria Configuration"
      />
      <Card className="listItem highligh flex flex-1 width-100 non-scroll">
        <Loading data={criteriaList?.getCriteriaList?.data} loading={false}>
          <>
            {criteriaList?.getCriteriaList?.data?.length > 0 ? (
              <>
                <div className="flex mb-10 p-horizontal-20 flex-dir-r flex-jc-sb flex-ai-c flex-ai-c">
                  <div className="bold">(Total: {criteriaList?.getCriteriaList?.total})</div>
                  <div className="flex flex-dir-r flex-jc-c  flex-ai-c">
                    <Pagination
                      size="default"
                      defaultCurrent={1}
                      current={page}
                      total={criteriaList?.getCriteriaList?.total}
                      pageSize={size}
                      onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
                    />
                  </div>
                </div>
                <Divider style={{ marginBottom: 0 }} />
                <div className="flex p-10 flex-1 flex-gap-10 non-scroll">
                  <Table
                    className="flex flex-1 scrollable"
                    columns={columns}
                    dataSource={criteriaList?.getCriteriaList?.data}
                    sticky
                    pagination={false}
                  />
                </div>
              </>
            ) : (
              <Empty
                description="Data empty, Let's creating new one."
                className="flex flex-1 flex-dir-c flex-ai-c flex-jc-c"
              />
            )}
          </>
        </Loading>
      </Card>
    </div>
  );
}
