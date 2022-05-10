import React, { useEffect, useState } from 'react';
import { Button, Card, Empty, PageHeader, Pagination, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CreateHealthCheckDefault from './CreateHeatlhCheckDefault';
import { useQuery } from '@apollo/client';
import { TemplateQueries } from '../../../grapql-client/queries';
import { getTemplatesResult, getTemplatesVars } from '../../../grapql-client/queries/TemplateQueries';
import { getTeamsVars } from '../../../grapql-client/queries/TeamQueries';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { queries } from '@testing-library/react';
import moment from 'moment';
import EditTemplateHealthCheck from './EditTemplateHealthCheck';
import { Template } from '../../../types';
import Loading from '../../../components/Loading/loading';

const { Meta } = Card;
type Props = {
  isAdmin: boolean;
};

export default function HealthCheckConfiguration({ isAdmin }: Props) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
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
      offSet: (page - 1) * size,
      limit: size,
    },
  });

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  useEffect(() => {
    refetch();
  }, [searchText, page, size]);

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <>
      <CreateHealthCheckDefault isVisible={isVisible} setIsVisible={setIsVisible} refetch={refetch} />
      <EditTemplateHealthCheck template={selectedTemplate} setTemplate={setSelecktedTemplate} />
      <div className="healthCheckConfiguration flex flex-1">
        <PageHeader onBack={() => history.push('/admin/system-configuration')} title="Health Check Configuration" />
        <div className="action flex flex-dir-r flex-gap-10">
          <div className="filterBox flex flex-1 flex-dir-c">
            <SearchBar placeholder="What are you looking for ?" isLoading={false} onHandleSearch={onHandleSearch} />
          </div>
          <Button type="primary" onClick={() => setIsVisible(true)}>
            Create
          </Button>
        </div>
        <div className="listItem  flex flex-1 width-100 scrollable">
          <Loading data={templates} loading={loading}>
            <>
              {templates?.getTemplates?.data?.length > 0 ? (
                <>
                  <div className="flex p-20 flex-1 flex-gap-10 scrollable">
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
                            <Button danger icon={<DeleteOutlined />}>
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-dir-r flex-jc-sb flex-ai-bl  mt-10">
                          <div className="flex flex-dir-r flex-gap-5">
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
                  <div className="flex flex-dir-r flex-ai-c flex-gap-10  mt-25">
                    <Pagination
                      defaultCurrent={1}
                      current={page}
                      total={templates?.getTemplates?.total}
                      defaultPageSize={10}
                      pageSize={size}
                      onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
                    />
                    <div>(Total: {templates?.getTemplates?.total})</div>
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
        </div>
      </div>
    </>
  );
}
