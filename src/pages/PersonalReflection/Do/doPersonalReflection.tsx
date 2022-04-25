import React, { useState, useContext, useEffect, useRef } from 'react';
import { Tabs, Avatar, Tooltip, Button, Badge, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { AssessmentQueries, TeamQueries } from '../../../grapql-client/queries';
import { Evaluation, Result, Team } from '../../../types';
import CriteriaQuestionsList from './criteriaQuestionsList';
import selfContext from '../../../contexts/selfContext';
import _ from 'lodash';
import AvatarPersonalReflection from './avatarPersonalReflection';
import moment from 'moment';
import Countdown from '../../../components/CountDown/countdown';
import { Link, useHistory } from 'react-router-dom';
import { AssessmentMutations } from '../../../grapql-client/mutations';

const { TabPane } = Tabs;
const { Option } = Select;

type Props = {
  teamId: string;
  assessmentId: string;
  setTeam: (value: Team) => void;
};

export default function DoPersonalReflection({ teamId, assessmentId, setTeam }: Props) {
  const [evaluation, setEvaluation] = useState<Evaluation>();
  const [mainEvaluation, setMainEvaluation] = useState<Evaluation>();
  const [isChanged, setIsChanged] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllowEdit, setIsAllowEdit] = useState(false);
  const history = useHistory();
  const me = useContext(selfContext);

  const { data: teamData } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  useEffect(() => {
    setTeam(teamData?.team);
  }, [teamData]);

  const { data: assessmentData } = useQuery<AssessmentQueries.getAssessmentResult, AssessmentQueries.getAssessmentVars>(
    AssessmentQueries?.getAssessment,
    {
      variables: {
        teamId,
        assessmentId,
      },
    },
  );

  const [submitPersonal] = useMutation<
    AssessmentMutations.submitDoPersonalResult,
    AssessmentMutations.submitDoPersonalVars
  >(AssessmentMutations?.submitDoPersonalReflection, {
    onError: (error) => {
      console.log(error);
    },
    onCompleted: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const evaluation =
      assessmentData?.getAssessment?.evaluations.find((x) => x?.assessorId === iMember?.id) ||
      assessmentData?.getAssessment?.evaluations[0];
    setMainEvaluation(evaluation);
    setEvaluation(evaluation);
    setIsChanged(false);
  }, [assessmentData]);

  useEffect(() => {
    setIsCompleted(evaluation?.results?.every((x) => x?.answerOnCriteriaList?.every((y) => y?.point)));
    const isChanged = !_?.isEqual(mainEvaluation, evaluation);
    console.log('is changed', isChanged);
    setIsChanged(isChanged);
  }, [evaluation]);

  const handleUpdateMemberAnswer = (value: Result) => {
    const cloneMemberAnswerList = [
      ...evaluation?.results?.map((result) => {
        if (result?.id === value?.id) {
          return value;
        }
        return result;
      }),
    ];
    setEvaluation({
      ...evaluation,
      results: cloneMemberAnswerList,
    });
  };

  const iMember = teamData?.team?.members.find((member) => member.userId === me?.id);

  useEffect(() => {
    if (iMember?.id === evaluation?.assessorId) {
      setIsAllowEdit(true);
    } else {
      setIsAllowEdit(false);
    }
  }, [iMember, evaluation]);

  const renderEvaluationOption = assessmentData?.getAssessment?.evaluations?.map((evaluation) => (
    <Option key={evaluation?.assessor?.user?.id} value={evaluation?.id}>
      <Avatar
        style={{ marginRight: '1px' }}
        size="default"
        shape="circle"
        src={<img src={evaluation?.assessor?.user?.picture} referrerPolicy="no-referrer" />}
      />
      <span className="ml-12">{evaluation?.assessor?.user?.nickname}</span>
    </Option>
  ));

  const handleSelectEvaluation = (value: string) => {
    setEvaluation(assessmentData?.getAssessment?.evaluations?.find((evalue) => evalue?.id === value));
  };

  return (
    <>
      {iMember?.id !== assessmentData?.getAssessment?.evaluations[0]?.assessorId &&
      !(iMember?.isSuperOwner || iMember?.isOwner) ? (
        <div className="flex flex-1 flex-ai-c flex-jc-c">
          <h3>Uh oh! You are not evaluator of this Assessment</h3>
          <div className="mt-12">
            <Button onClick={() => history?.push(`/personal-reflect/manage/${teamId}`)}>Back to Manage</Button>
          </div>
        </div>
      ) : (
        <div className="doPersonalReflection">
          <div className="personalSection">
            <div className="assessmentTitle">{assessmentData?.getAssessment?.name}</div>
            <div className="actionDoPersionalReflection">
              <Button onClick={() => history?.push(`/personal-reflect/manage/${teamData?.team?.id}`)}>
                Back to Manage{' '}
              </Button>
              <Button onClick={() => history?.push(`/personal-reflect/analysis-assessment/${teamId}/${assessmentId}`)}>
                Analysis
              </Button>
              <Button type="primary">Evaluation(s)</Button>
            </div>
          </div>
          <div className="content flex">
            <div className="headerOfDoPersonalReflection">
              <div className="flex flex-dir-r flex-ai-c">
                <Select
                  onSelect={handleSelectEvaluation}
                  value={evaluation?.id}
                  className="select"
                  style={{ width: 300 }}
                  size="large"
                >
                  {[...(renderEvaluationOption || [])]}
                </Select>
              </div>
              {assessmentData?.getAssessment?.status == 'Doing' && (
                <div className="bold  ">
                  End after{' '}
                  <Countdown
                    startTime={+assessmentData?.getAssessment?.startDate || moment().valueOf()}
                    endTime={+assessmentData?.getAssessment?.endDate || moment().valueOf()}
                  />
                </div>
              )}
              {assessmentData?.getAssessment?.status == 'Planned' && (
                <div className="bold">
                  Starting at {moment(+assessmentData?.getAssessment?.startDate).format('DD/MM/YYYY')}
                </div>
              )}

              <div className="bold">
                <div className="bold">Status: {evaluation?.isSubmit ? 'Submited' : 'Unsubmit'}</div>
              </div>
            </div>
            {assessmentData?.getAssessment?.status == 'Planned' ? (
              <div className="flex flex-ai-c flex-jc-c flex-1">Not Started Yet</div>
            ) : (
              <Tabs
                style={{ height: '100%' }}
                tabBarExtraContent={{
                  right: (
                    <>
                      {isAllowEdit && (
                        <div style={{ margin: '0px 10px 0px 10px' }} className="actions flex flex-dir-c flex-gap-10">
                          {
                            <>
                              {/* <Button>ReOpen</Button>
                              <Button>Share</Button> */}
                              <Button
                                loading={isLoading}
                                onClick={async () => {
                                  setIsLoading(true);
                                  await submitPersonal({
                                    variables: {
                                      teamId: teamId,
                                      assessmentId: assessmentId,
                                      assessorId: me?.id,
                                      results: evaluation?.results?.map((result) => ({
                                        id: result?.id,
                                        concerningMemberId: result?.concerningMemberId,
                                        answerOnCriteriaList: result?.answerOnCriteriaList?.map((answer) => ({
                                          id: answer?.id,
                                          criteriaId: answer?.criteriaId,
                                          point: answer?.point,
                                          comment: answer?.comment,
                                        })),
                                      })),
                                    },
                                  });

                                  setIsLoading(false);
                                }}
                                disabled={!isChanged || !isCompleted}
                              >
                                Submit
                              </Button>
                            </>
                          }
                        </div>
                      )}
                    </>
                  ),
                }}
                tabPosition="left"
              >
                <>
                  {evaluation?.results?.map((result) => (
                    <TabPane
                      tab={<AvatarPersonalReflection member={result?.concerningMember} result={result} />}
                      key={`${result?.concerningMember?.id}`}
                    >
                      <CriteriaQuestionsList
                        isAllowEdit={isAllowEdit}
                        key={result?.concerningMember?.id}
                        member={result?.concerningMember}
                        result={result}
                        setResult={handleUpdateMemberAnswer}
                      />
                    </TabPane>
                  ))}
                </>
              </Tabs>
            )}
          </div>
        </div>
      )}
    </>
  );
}
