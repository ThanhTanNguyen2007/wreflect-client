import React, { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';
import moment from 'moment';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { SortDescendingOutlined, SortAscendingOutlined, AimOutlined } from '@ant-design/icons';
import { Button, Card, Pagination, Select, Tooltip, Modal, Empty } from 'antd';

import { AssessmentQueries, CriteriaQueries, TeamQueries } from '../../../grapql-client/queries';
import CreatingAssessmentModal from './creatingAssessmentModal';
import { sortAssessmentsByEnum, orderWithEnum } from '../../../grapql-client/queries/assessmentQueries';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UpdateAssessmentModal from './updateAssessmentModal';
import { Loading } from '../../../components/Loading';
import selfContext from '../../../contexts/selfContext';
import { Assessment, Team } from '../../../types';
import { AssessmentMutations } from '../../../grapql-client/mutations';
const { confirm } = Modal;
const { Option } = Select;

type Props = {
  teamId: string;
  setTeam: (team: Team) => void;
};

export default function ManageJudge({ teamId, setTeam }: Props) {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState(sortAssessmentsByEnum.createdAt);
  const [orderWith, setOrderWith] = useState(orderWithEnum.desc);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const me = useContext(selfContext);

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>();

  const { data: criteriaListData } = useQuery<CriteriaQueries.getEssentialResult>(CriteriaQueries.getEssential);

  const {
    data,
    loading,
    refetch: teamRefetch,
    error: teamError,
  } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  const {
    data: assessmentData,
    refetch: assessmentDataRefetch,
    error: assessmentError,
  } = useQuery<AssessmentQueries.getAssessmentsResult, AssessmentQueries.getAssessmentsVars>(
    AssessmentQueries.getAssessments,
    {
      variables: {
        teamId,
        search: searchText,
        sortBy,
        orderWith,
        page,
        size,
      },
    },
  );

  useEffect(() => {
    setTeam(data?.team);
  }, [data]);

  const onHandleSort = (value: string) => {
    const sortProps = value?.split('_');
    setSortBy(sortProps[0] as sortAssessmentsByEnum);
    setOrderWith(sortProps[1] as orderWithEnum);
  };

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
    setPage(1);
  };

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  return (
    <Loading
      data={!_?.isNull(data) && !_?.isNull(assessmentData)}
      loading={loading}
      error={teamError || assessmentError}
    >
      <>
        <div>
          <div className="personalSection">
            <div className={`manageJudge primary`}>Manage</div>
            <div onClick={() => history?.push(`/personal-reflect/analysis/${data?.team?.id}`)} className={`analysis`}>
              Analysis
            </div>
          </div>
        </div>
        <div className="manageJudgePage content">
          <div className="actionSection">
            <SearchBar placeholder="What are you looking for ?" isLoading={loading} onHandleSearch={onHandleSearch} />
            <Select defaultValue="createdAt_desc" onSelect={onHandleSort}>
              <Option key="NAME_ASC" value="createdAt_desc">
                <SortAscendingOutlined /> Sort By Descending Date
              </Option>
              <Option key="NAME_DESC" value="createdAt_asc">
                <SortDescendingOutlined /> Sort By Ascending Date
              </Option>
              <Option key="DATE_ASC" value="name_desc">
                <SortAscendingOutlined /> Sort By Descending Name
              </Option>
              <Option key="DATE_DESC" value="name_asc">
                <SortDescendingOutlined /> Sort By Ascending Name
              </Option>
              <Option key="STATUS_ASC" value="status_desc">
                <SortAscendingOutlined /> Sort By Descending Status
              </Option>
              <Option key="STATUS_DESC" value="status_asc">
                <SortDescendingOutlined /> Sort By Ascending Status
              </Option>
            </Select>
            {(iMember?.isSuperOwner || iMember?.isOwner) && (
              <div>
                <Button onClick={() => setIsCreateModalVisible(true)} type="primary">
                  Create Assessment
                </Button>
              </div>
            )}
          </div>
          <div className="assessmentContainer"></div>
          <CreatingAssessmentModal
            criteriaData={criteriaListData?.getEssential?.criteriaList}
            team={data?.team}
            isVisible={isCreateModalVisible}
            setVisible={setIsCreateModalVisible}
          />
          <UpdateAssessmentModal
            assessment={selectedAssessment}
            criteriaData={criteriaListData?.getEssential?.criteriaList}
            team={data?.team}
            isVisible={isUpdateModalVisible}
            setVisible={setIsUpdateModalVisible}
          />
          <div className="container">
            {assessmentData?.getAssessments?.data?.length != 0 ? (
              <>
                <div style={{ marginTop: '50px' }} className="flex flex-ai-c flex-jc-c mt-25">
                  <Pagination
                    defaultCurrent={1}
                    current={page}
                    total={assessmentData?.getAssessments?.total}
                    defaultPageSize={8}
                    pageSize={size}
                    onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
                  />
                </div>
                <div className="listOfAssessment">
                  {assessmentData?.getAssessments?.data?.map((assessment) => (
                    <>
                      <Card
                        key={assessment?.id}
                        className={`mt-25 ${assessment?.status == 'Complete' && 'done'}`}
                        hoverable
                      >
                        <div className="assessmentCard ">
                          <div className="inforAssessment">
                            <div className="fieldInfor">
                              <div className="upperCase">Name:</div>
                              {assessment?.name?.toUpperCase()}
                            </div>
                            <div className="fieldInfor">
                              <div className="upperCase">Status:</div>
                              {assessment.status}
                            </div>
                            <div className="flex flex-dir-r">
                              <h3>{moment(+assessment.startDate).format('DD/MM/YYYY')}</h3>
                              <h3>{moment(+assessment.endDate).format('DD/MM/YYYY')}</h3>
                            </div>
                          </div>
                          <div className="actionAssessment">
                            <Tooltip title="Do Personal Reflection">
                              <Button
                                type="text"
                                onClick={() => history.push(`/personal-reflect/do/${teamId}/${assessment?.id}`)}
                                icon={<AimOutlined />}
                              />
                            </Tooltip>
                            <Tooltip title="Edit">
                              <Button
                                type="text"
                                onClick={() => {
                                  setSelectedAssessment(assessment);
                                  setIsUpdateModalVisible(true);
                                }}
                                icon={<EditOutlined />}
                              />
                            </Tooltip>
                            {/* <Tooltip title="Delete">
                        <Button onClick={(

                        )} type="text" icon={<DeleteOutlined/> }>
                        </Button>
                      </Tooltip> */}
                            <DeleteAssessmentButton teamId={teamId} assessmentId={assessment?.id} />
                          </div>
                        </div>
                      </Card>
                    </>
                  ))}
                </div>
              </>
            ) : (
              <Empty description="No Assessments Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
            )}
          </div>
        </div>
      </>
    </Loading>
  );
}

function DeleteAssessmentButton({ teamId, assessmentId }: { teamId: string; assessmentId: string }) {
  const [deleteAssessment, { loading }] = useMutation<
    AssessmentMutations.deleteAssessmentResult,
    AssessmentMutations.deleteAssessmentVars
  >(AssessmentMutations?.deleteAssessment, {
    refetchQueries: ['getAssessmentsList'],
  });

  return (
    <Tooltip title="Delete">
      <Button
        loading={loading}
        onClick={async () =>
          confirm({
            title: 'Do you Want to delete these items?',
            centered: true,
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk: async () => {
              await deleteAssessment({
                variables: {
                  teamId,
                  assessmentId,
                },
              });
            },
            onCancel() {
              console.log('Cancel');
            },
          })
        }
        type="text"
        icon={<DeleteOutlined />}
      />
    </Tooltip>
  );
}
