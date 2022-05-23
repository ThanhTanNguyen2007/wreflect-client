import React, { useEffect, useState } from 'react';
import { Button, Divider, Modal, Card, Empty, PageHeader, Pagination, Tooltip, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CreateHealthCheckDefault from './CreateHeatlhCheckDefault';
import { useMutation, useQuery } from '@apollo/client';
import { TemplateQueries } from '../../../grapql-client/queries';
import { getTemplatesResult, getTemplatesVars } from '../../../grapql-client/queries/TemplateQueries';
import { getTeamsVars } from '../../../grapql-client/queries/TeamQueries';
import { EditOutlined, DeleteOutlined, WarningTwoTone } from '@ant-design/icons';
import { queries } from '@testing-library/react';
import moment from 'moment';
import EditTemplateHealthCheck from './EditTemplateHealthCheck';
import { Template } from '../../../types';
import Loading from '../../../components/Loading/loading';
import { TemplateMutations } from '../../../grapql-client/mutations';
import { deleteTemplateRusult, deleteTemplateVars } from '../../../grapql-client/mutations/TemplateMutation';

type Props = {
  isAdmin: boolean;
};
const { confirm } = Modal;

export default function HealthCheckConfiguration({ isAdmin }: Props) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTemplate, setSelecktedTemplate] = useState<Template>();
  const history = useHistory();

  const {
    data: templates,
    loading,
    refetch,
  } = useQuery<getTemplatesResult, getTemplatesVars>(TemplateQueries.getTemplates, {
    variables: {
      search: searchText,
      page,
      size,
    },
    fetchPolicy: 'network-only',
  });

  const [deleteTemplate] = useMutation<deleteTemplateRusult, deleteTemplateVars>(TemplateMutations.deleteTemplate, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
    onCompleted: () => {
      notification.success({
        placement: 'bottomRight',
        message: `Delete Template Success`,
      });
    },
    refetchQueries: ['getTemplates'],
  });

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <>
      {page > 1 && templates?.getTemplates?.data?.length == 0 && setPage(page - 1)}
      <CreateHealthCheckDefault isVisible={isVisible} setIsVisible={setIsVisible} refetch={refetch} />
      <EditTemplateHealthCheck template={selectedTemplate} setTemplate={setSelecktedTemplate} />
      <div className="healthCheckConfiguration p-10 flex flex-1">
        <PageHeader
          className="site-page-header mb-10"
          extra={
            <>
              <div className="action flex flex-dir-r flex-gap-10">
                <div className="filterBox flex flex-1 flex-dir-c">
                  <SearchBar
                    placeholder="What are you looking for ?"
                    isLoading={false}
                    onHandleSearch={onHandleSearch}
                  />
                </div>
                <Button type="primary" onClick={() => setIsVisible(true)}>
                  Create
                </Button>
              </div>
            </>
          }
          onBack={() => history.push('/admin/system-configuration')}
          title="Health Check Configuration"
        />
        <Card hoverable className="listItem flex flex-1 width-100 non-scroll highligh">
          <Loading data={templates} loading={loading}>
            <>
              {templates?.getTemplates?.data?.length > 0 ? (
                <>
                  <div className="flex mb-10 p-horizontal-20 flex-dir-r flex-jc-sb flex-ai-c flex-ai-c">
                    <div className="bold">(Total: {templates?.getTemplates?.total})</div>
                    <div className="flex flex-dir-r flex-jc-c  flex-ai-c">
                      <Pagination
                        size="default"
                        defaultCurrent={1}
                        current={page}
                        total={templates?.getTemplates?.total}
                        pageSize={size}
                        onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
                      />
                    </div>
                  </div>
                  <Divider style={{ marginBottom: 0 }} />
                  <div className="flex p-10 flex-1 flex-gap-10 scrollable">
                    {templates?.getTemplates?.data?.map((template) => (
                      <Card hoverable key={template?.id}>
                        <div className="flex flex-dir-r flex-jc-sb">
                          {template?.title}
                          <div className="flex flex-dir-r flex-gap-5">
                            <Button
                              onClick={() => setSelecktedTemplate(template)}
                              type="primary"
                              icon={<EditOutlined />}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() =>
                                confirm({
                                  title: 'Are you sure want to delete this template?',
                                  icon: <WarningTwoTone twoToneColor="red" />,
                                  content: 'Deleting this template may effect to other data',
                                  okType: 'danger',
                                  okText: 'Delete',
                                  okButtonProps: { type: 'primary' },
                                  onOk: async () => {
                                    await deleteTemplate({
                                      variables: {
                                        templateId: template?.id,
                                      },
                                    });
                                  },
                                })
                              }
                              danger
                              icon={<DeleteOutlined />}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-dir-r flex-jc-sb flex-ai-bl  mt-10">
                          <div className="flex flex-dir-r flex-gap-5 flex-wrap">
                            {template?.healthCheckQuestions?.map((question) => (
                              <Tooltip title={question?.description} key={question?.id} placement={'bottom'}>
                                <span className={`statement ${question?.color}`}>{question?.title}</span>
                              </Tooltip>
                            ))}
                          </div>
                          <div>{moment(+template?.createdAt).format('DD/MM/YYYY hh:mm:ss')}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Empty
                  description="No Template Health Check Data"
                  className="flex flex-1 flex-dir-c flex-ai-c flex-jc-c"
                />
              )}
            </>
          </Loading>
        </Card>
      </div>
    </>
  );
}
