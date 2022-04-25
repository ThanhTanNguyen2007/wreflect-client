import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { Button, Modal, notification, Select, Switch, Spin } from 'antd';
import React, { useState, useContext, Suspense } from 'react';
import { TopNavBar } from '../../components/TopNavBar';
import { HealthCheckQueries, TeamQueries } from '../../grapql-client/queries';
import { HealthCheckMutations } from '../../grapql-client/mutations';

import templatesHealthCheck from '../../const/healthCheckTemplateDemo';
import { Board, Member } from '../../types';
import { useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
// import ResultHealthCheck from './resultHealthCheck';
import { useHistory } from 'react-router-dom';
import Statement from './Statement';
import selfContext from '../../contexts/selfContext';
import { HealthCheckSubscription } from '../../grapql-client/subcriptions';

const ResultHealthCheck = React.lazy(() => import('./resultHealthCheck'));

type Props = {
  teamId: string;
  boardId: string;
};

type template = {
  id: string;
  title: string;
  statements: {
    id: string;
    title: string;
    color: string;
    bad: string;
    good: string;
  }[];
};

const { Option } = Select;

export default function HealthCheck({ teamId, boardId }: Props) {
  const history = useHistory();
  const [isViewResult, setIsViewResult] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>();
  const [selecteTemplate, setSelectedTemplate] = useState<template>();
  const me = useContext(selfContext);
  const [templateDataLanguage, setTemplateDataLanguage] = useState(templatesHealthCheck.EN);
  const [isVNLanguage, setIsVNLanguage] = useState(false);

  const [answers, setAnswers] = useState<{ questionId: string; value: string }[]>([]);
  const [comments, setComments] = useState<{ questionId: string; text: string }[]>([]);

  const { data, client } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  const { data: healthCheckData, refetch } = useQuery<
    HealthCheckQueries.getBoardResult,
    HealthCheckQueries.getBoardVars
  >(HealthCheckQueries.getHealthCheck, {
    variables: {
      teamId,
      boardId,
    },
  });

  const [startSurvey] = useMutation<HealthCheckMutations.startSurveyResult, HealthCheckMutations.startSurveyVars>(
    HealthCheckMutations.startSurvey,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
      updateQueries: {
        getHealthCheck: (previousData, { mutationResult }) => {
          return { getHealthCheck: mutationResult?.data?.startSurveyHealthCheck };
        },
      },
    },
  );

  const [setAnswerHealthCheck] = useMutation<
    HealthCheckMutations.setAnswerHealthCheckResult,
    HealthCheckMutations.setAnswerHealthCheckVars
  >(HealthCheckMutations.setAnswerHealthCheck, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
    updateQueries: {
      getHealthCheck: (previousData, { mutationResult }) => {
        return { getHealthCheck: mutationResult?.data?.answerHealthCheck };
      },
    },
  });

  const [reopenHealthCheck] = useMutation<
    HealthCheckMutations.reopenHealthCheckResult,
    HealthCheckMutations.reopenHealthCheckVars
  >(HealthCheckMutations.reopenHealthCheck, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
    updateQueries: {
      getHealthCheck: (previousData, { mutationResult }) => {
        return { getHealthCheck: mutationResult?.data?.reopenHealthCheck };
      },
    },
    variables: {
      teamId,
      boardId,
    },
  });

  useSubscription<HealthCheckSubscription.reopenHealthCheckResult, HealthCheckSubscription.reopenHealthCheckVars>(
    HealthCheckSubscription.updateGetHealthCheckData,
    {
      variables: {
        meId: me?.id,
        teamId: data?.team?.id,
      },
      onSubscriptionData: ({ subscriptionData, client }) => {
        console.log('subscriptionData', subscriptionData?.data);
        client.cache.updateQuery(
          {
            query: HealthCheckQueries.getHealthCheck,
            variables: {
              teamId,
              boardId,
            },
          },
          (data) => ({
            getHealthCheck: subscriptionData?.data?.subOnUpdateHealthCheck,
          }),
        );
      },
    },
  );

  const handleOnRateChange = (questionId: string, value: string) => {
    const existantAnswer = answers.find((answer) => answer.questionId === questionId);
    if (existantAnswer) {
      setAnswers(
        answers.map((answers) => {
          if (answers.questionId === questionId) {
            return { ...answers, value };
          } else return answers;
        }),
      );
    } else {
      setAnswers([...answers, { questionId, value }]);
    }
  };

  const handleOnCommentChange = (questionId: string, text: string) => {
    const existantComments = comments.find((comment) => comment.questionId === questionId);
    if (existantComments) {
      setComments(
        comments.map((comment) => {
          if (comment.questionId === questionId) {
            return { ...comment, text };
          } else return comment;
        }),
      );
    } else {
      setComments([...comments, { questionId, text }]);
    }
  };

  useEffect(() => {
    setSelectedBoard(data?.team?.boards.find((board) => board.id === boardId));
    setAnswers([]);
    setComments([]);
    setIsViewResult(false);
    setSelectedTemplate(
      templateDataLanguage.find(
        (template) => template.id === healthCheckData?.getHealthCheck?.healthCheck?.templateId,
      ) || null,
    );
  }, [teamId, boardId, data, healthCheckData]);

  // useEffect(() => {
  //   setSelectedTemplate(
  //     templateDataLanguage.find(
  //       (template) => template.id === healthCheckData?.getHealthCheck?.healthCheck?.templateId,
  //     ) || null,
  //   );
  // }, [healthCheckData]);

  useEffect(() => {
    if (isVNLanguage) {
      setTemplateDataLanguage(templatesHealthCheck.VN);
    } else {
      setTemplateDataLanguage(templatesHealthCheck.EN);
    }
  }, [isVNLanguage]);

  useEffect(() => {
    setSelectedTemplate(
      templateDataLanguage.find(
        (template) => template.id === healthCheckData?.getHealthCheck?.healthCheck?.templateId,
      ) || null,
    );
  }, [templateDataLanguage]);

  const renderListOptionBoard = data?.team?.boards?.map((board) => (
    <Option value={board?.id} key={board?.id}>
      {board?.title}
    </Option>
  ));

  const handleSelectBoard = (value: string) => {
    // setSelectedBoard(data?.team?.boards?.find((board) => board.id === value));
    history.push(`/team-health/${teamId}/${value}`);
  };

  const handleSubmitHealthCheck = () => {
    window.scrollTo({
      top: 50,
      behavior: 'smooth',
    });
    if (selecteTemplate.statements.length !== answers.length) {
      console.log('answers are', answers, answers?.length);
      console.log(selecteTemplate?.statements?.length);
      notification.error({ message: 'Please answer all question.', placement: 'bottomRight' });
      return;
    } else {
      setAnswerHealthCheck({
        variables: {
          teamId,
          boardId,
          templateId: selecteTemplate.id,
          answers,
          comments,
        },
      });
    }
  };

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  const answerOfCurrentUser = healthCheckData?.getHealthCheck?.memberAnswers?.find(
    (answer) => answer?.memberId === iMember?.id,
  );

  return (
    <div className="healthCheckPage">
      <TopNavBar iMember={iMember} team={data?.team} boardId={boardId} title="Health Check" />

      <div className="team-health">
        {healthCheckData?.getHealthCheck?.healthCheck ? (
          <>
            <div className="header-content">
              <Select onSelect={handleSelectBoard} value={boardId} style={{ width: '200px' }}>
                {renderListOptionBoard}
              </Select>
              <div className="templates-overview poll-center-items">
                <Button onClick={() => history.push(`/board/${teamId}/${boardId}`)} type="ghost">
                  Go To Board
                </Button>
                <Button
                  onClick={() => {
                    setIsVNLanguage(!isVNLanguage);
                  }}
                  style={{ margin: '0px 5px 0px 5px' }}
                  type="ghost"
                >
                  {isVNLanguage ? 'EN language' : 'VN language'}
                </Button>
                {!answerOfCurrentUser ? (
                  <>
                    {isViewResult ? (
                      <Button onClick={() => setIsViewResult(false)}>Go To Survey</Button>
                    ) : (
                      <Button onClick={() => setIsViewResult(true)}>Show Results</Button>
                    )}
                  </>
                ) : (
                  <>
                    {(iMember?.isOwner || iMember?.isSuperOwner) && (
                      <Button
                        style={{ marginLeft: '10px' }}
                        onClick={() => {
                          Modal.confirm({
                            title: 'Are you sure want to Reopen this health check',
                            centered: true,
                            okText: 'Reopen',
                            cancelText: 'Cancel',
                            onOk: async () => {
                              console.log('hello world');
                              reopenHealthCheck();
                            },
                          });
                        }}
                        type="ghost"
                      >
                        Reopen
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="health-check-answer">
              <div className="templates-overview poll-center-items">
                <div className="templates-overview-card poll-center-items" style={{ height: 'auto', minHeight: '0px' }}>
                  <h3>{selecteTemplate?.title}</h3>
                </div>
              </div>
              {isViewResult || answerOfCurrentUser ? (
                <>
                  <Suspense
                    fallback={
                      <div className="flex flex-ai-c flex-jc-c" style={{ flex: 1, height: '100vh' }}>
                        <Spin size="large" />
                      </div>
                    }
                  >
                    <div className="chartjs-size-monitor-expand">
                      <ResultHealthCheck
                        teamId={teamId}
                        boardId={boardId}
                        healthCheckData={healthCheckData}
                        selectedTemplate={selecteTemplate}
                      />
                    </div>
                  </Suspense>
                  <div className="templates-overview poll-center-items">
                    <div
                      className="templates-overview-card poll-center-items"
                      style={{ height: 'auto', minHeight: '0px' }}
                    >
                      <h3>
                        Response Rate{' '}
                        {`${healthCheckData.getHealthCheck.memberAnswers.length}/${data?.team?.members.length} (${
                          (healthCheckData.getHealthCheck.memberAnswers.length * 100) / data?.team?.members.length
                        }%)`}
                      </h3>
                    </div>
                  </div>
                  {answerOfCurrentUser && (
                    <div className="templates-overview poll-center-items">
                      {selecteTemplate?.statements.map((statement) => (
                        <>
                          <div
                            style={{ cursor: 'default' }}
                            className="templates-overview-card card  poll-center-items"
                            key={statement.id}
                          >
                            <Statement
                              answerOfCurrentUser={answerOfCurrentUser}
                              commentOfAllMembers={healthCheckData?.getHealthCheck?.memberComments?.filter(
                                (comment) => comment?.questionId === statement.id,
                              )}
                              handleOnRateChange={handleOnRateChange}
                              handleOnCommentChange={handleOnCommentChange}
                              statement={statement}
                            />
                          </div>
                        </>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="templates-overview poll-center-items">
                    {selecteTemplate?.statements.map((statement) => (
                      <div className="templates-overview-card card poll-center-items" key={statement.id}>
                        <Statement
                          handleOnRateChange={handleOnRateChange}
                          handleOnCommentChange={handleOnCommentChange}
                          statement={statement}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-jc-c flex-ai-c">
                    <Button onClick={handleSubmitHealthCheck} size="large">
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {!selecteTemplate ? (
              <>
                <div className="header-content">
                  <Select onSelect={handleSelectBoard} value={selectedBoard?.id} style={{ width: '200px' }}>
                    {renderListOptionBoard}
                  </Select>
                  <div>
                    <Button
                      onClick={() => {
                        setIsVNLanguage(!isVNLanguage);
                      }}
                      style={{ marginRight: '10px' }}
                      type="ghost"
                    >
                      {isVNLanguage ? 'EN language' : 'VN language'}
                    </Button>

                    <Button onClick={() => history.push(`/board/${teamId}/${boardId}`)} type="ghost">
                      Go To Board
                    </Button>
                  </div>
                </div>
                <div className="templates-overview">
                  {templateDataLanguage.map((card) => (
                    <div
                      onClick={() => {
                        if (
                          data?.team?.members.find((member) => {
                            return member?.userId === me?.id && (member?.isOwner || member?.isSuperOwner);
                          })
                        ) {
                          setSelectedTemplate(card);
                        } else {
                          notification.warning({
                            message: 'Permission denied',
                            description: 'Only Super Owner and Owners can access HeathCheck templates.',
                            placement: 'bottomRight',
                          });
                        }
                      }}
                      key={card?.id}
                      className="templates-overview-card poll-center-items"
                    >
                      <h3>{card?.title}</h3>
                      <div className="statement-wrapper poll-center-items">
                        {card?.statements.map((statement) => (
                          <span className={`statement ${statement?.color}`} key={statement.title}>
                            {statement?.title}
                          </span>
                        ))}
                      </div>
                      <Button style={{ fontSize: '10px' }} type="default" size="small">
                        {isVNLanguage ? 'Xem Chi Tiết' : 'Show Details'}
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                {/* <Button onClick={() => setSelectedTemplate(null)}>Go Back</Button> */}
                <div className="templates-overview poll-center-items">
                  <Button onClick={() => setSelectedTemplate(null)}>Go Back</Button>
                  <Button
                    onClick={() => {
                      setIsVNLanguage(!isVNLanguage);
                    }}
                    style={{ margin: '0px 5px 0px 5px' }}
                    type="ghost"
                  >
                    {isVNLanguage ? 'EN language' : 'VN language'}
                  </Button>
                  <Button
                    onClick={() =>
                      startSurvey({
                        variables: {
                          teamId,
                          boardId,
                          templateId: selecteTemplate.id,
                          isAnonymous: false,
                          isCustom: false,
                          status: 'OPEN',
                        },
                      })
                    }
                  >
                    Start Survey
                  </Button>
                </div>
                <div className="templates-overview poll-center-items">
                  <span style={{ marginRight: '10px' }} className="anonymous-label">
                    Collect Feedback Anonymously{' '}
                  </span>
                  <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
                </div>
                <div className="templates-overview poll-center-items">
                  <div
                    className="templates-overview-card poll-center-items"
                    style={{ height: 'auto', minHeight: '0px' }}
                  >
                    <h3>{selecteTemplate?.title}</h3>
                  </div>
                </div>
                <div className="templates-overview poll-center-items">
                  {selecteTemplate?.statements?.map((statement) => (
                    <div
                      key={statement?.title}
                      className="templates-overview-card card poll-center-items"
                      style={{ height: 'auto', minHeight: '180px', cursor: 'auto' }}
                    >
                      <h3>{statement?.title}</h3>
                      <p style={{ textAlign: 'center' }}>{statement?.good}</p>
                      <p style={{ textAlign: 'center' }}>{statement?.bad}</p>
                      <div className="num-wrapper poll-center-items">
                        <span className="num orange">1</span>
                        <span className="num blue">2</span>
                        <span className="num purple">3</span>
                        <span className="num lpink">4</span>
                        <span className="num green">5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
