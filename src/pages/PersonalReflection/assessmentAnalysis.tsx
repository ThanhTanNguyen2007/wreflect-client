import { useLazyQuery, useQuery } from '@apollo/client';
import { Avatar, Button, notification, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AnalysisQueries, AssessmentQueries, TeamQueries } from '../../grapql-client/queries';
import { Evaluation, Team } from '../../types';
import { useHistory } from 'react-router-dom';
import AreaRadarChart from './areaRadarChart';
import RosePlotChart from './rosePlotChart';
import GroupedBulletChart from './groupedBulletChart';
import selfContext from '../../contexts/selfContext';
import _ from 'lodash';

const { Option } = Select;

type Props = {
  teamId: string;
  assessmentId: string;
  setTeam: (value: Team) => void;
};

export default function AssessmentAnalysis({ teamId, assessmentId, setTeam }: Props) {
  const history = useHistory();
  const [evaluation, setEvaluation] = useState<Evaluation>();
  const [numEvaluated, setNumEvaluated] = useState(0);
  const me = useContext(selfContext);

  const { data: teamData } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  const [getAnalyticData, { data: test, refetch: refetchChart, loading }] = useLazyQuery<
    AnalysisQueries.getAnalysisAssessmentResult,
    AnalysisQueries.getAnalysisAssessmentVars
  >(AnalysisQueries?.getAnalysisAssessment, {
    onError: (err) => {
      notification?.error({ message: {} });
    },
  });

  useEffect(() => {
    if (evaluation?.assessmentId) {
      getAnalyticData({
        variables: {
          teamId,
          assessmentId,
          memberId: evaluation?.assessorId,
        },
      });
    }
  }, [evaluation]);

  useEffect(() => {
    console.log('test', test?.getAnalysisAssessment?.areaRadarChartData);
    const numEvaluatedMem = test?.getAnalysisAssessment?.areaRadarChartData?.reduce((value, curr) => {
      if (curr.isSubmit) return value + 1;
      return value;
    }, 0);
    setNumEvaluated(numEvaluatedMem);
  }, [test]);

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

  const iMember = teamData?.team?.members.find((member) => member.userId === me?.id);

  useEffect(() => {
    const evaluation =
      assessmentData?.getAssessment?.evaluations.find((x) => x?.assessorId === iMember?.id) ||
      assessmentData?.getAssessment?.evaluations[0];
    setEvaluation(evaluation);
  }, [assessmentData]);

  const handleSelectEvaluation = (value: string) => {
    setEvaluation(assessmentData?.getAssessment?.evaluations?.find((evalue) => evalue?.id === value));
  };

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

  return (
    <div className="assessmentAnalysisPage">
      <div className="personalSection">
        <div className="assessmentTitle">{assessmentData?.getAssessment?.name}</div>
        <div className="actionDoPersionalReflection">
          <Button onClick={() => history?.push(`/personal-reflect/manage/${teamData?.team?.id}`)}>
            Back to Manage{' '}
          </Button>
          <Button type="primary">Analysis</Button>
          <Button onClick={() => history?.push(`/personal-reflect/do/${teamId}/${assessmentId}`)}>Evaluation(s)</Button>
        </div>
      </div>
      <div className="content flex">
        <div className="flex flex-dir-r flex-ai-c flex-jc-sb">
          <Select
            onSelect={handleSelectEvaluation}
            value={evaluation?.id}
            className="select"
            style={{ width: 300 }}
            size="large"
          >
            {[...(renderEvaluationOption || [])]}
          </Select>

          <div>
            <RefrechChart loading={loading} refetchChart={refetchChart} />
          </div>
        </div>

        {/* <div className="content flex flex-dir-r flex-ai-c flex-jc-c flex-gap-5">
          <h2>There are {`${numEvaluated} member(s) already evaluated `}</h2>
          <h2 style={{ color: '#a4a0f1' }}>{_?.startCase(evaluation?.assessor?.user?.nickname)}</h2>
        </div> */}

        <div className="content">
          <div className="areaRadarChart ">
            <AreaRadarChart areaRadarData={test?.getAnalysisAssessment?.areaRadarChartData} />
          </div>
        </div>
        <div className="rosePlotChart content">
          <RosePlotChart rosePlotData={test?.getAnalysisAssessment?.rosePlotChartData} />
        </div>
        <div className="groupedBulletChart content">
          <GroupedBulletChart rosePlotData={test?.getAnalysisAssessment?.rosePlotChartData} />
        </div>
      </div>
    </div>
  );
}

function RefrechChart({ loading, refetchChart }: { loading: boolean; refetchChart: () => void }) {
  const [timeClick, setTimeClick] = useState(0);

  useEffect(() => {
    let intervalId;
    if (timeClick > 0) {
      intervalId = setInterval(() => {
        setTimeClick(timeClick - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timeClick]);

  return (
    <div>
      <Button
        loading={loading}
        disabled={timeClick > 0}
        onClick={async () => {
          await refetchChart();
          setTimeClick(60);
          notification?.success({
            message: 'Refresh chart data successfully',
            placement: 'bottomRight',
          });
        }}
      >
        Refresh Chart {`${timeClick ? timeClick + '(s)' : ''}`}
      </Button>
    </div>
  );
}
