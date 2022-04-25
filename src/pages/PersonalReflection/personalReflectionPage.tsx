import { useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { TopNavBar } from '../../components/TopNavBar';
import { TeamQueries } from '../../grapql-client/queries';
import { Team } from '../../types';
import AnalysisPersonal from './analysisPersonal';
import ManageJudge from './manageJudge';
import queryString from 'query-string';
import { Loading } from '../../components/Loading';
import selfContext from '../../contexts/selfContext';
import DoPersonalReflection from './doPersonalReflection';
import { Button } from 'antd';
import AssessmentAnalysis from './assessmentAnalysis';

export default function personalReflectionPage() {
  const [team, setTeam] = useState<Team | null>();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const me = useContext(selfContext);

  const iMember = team?.members.find((member) => member.userId === me?.id);

  return (
    <>
      <TopNavBar iMember={iMember} title="Personal Reflection" team={team} />
      <div className="personalReflectionPage">
        <Switch>
          <Route
            path={`${path}/manage/:teamId`}
            exact
            render={({ match }) => <ManageJudge teamId={match.params.teamId} setTeam={setTeam} />}
          />
          <Route
            path={`${path}/do/:teamId/:assessmentId`}
            render={({ match }) => (
              <DoPersonalReflection
                teamId={match?.params?.teamId}
                assessmentId={match?.params?.assessmentId}
                setTeam={setTeam}
              />
            )}
          />
          <Route
            path={`${path}/analysis-assessment/:teamId/:assessmentId`}
            render={({ match }) => (
              <AssessmentAnalysis
                teamId={match?.params?.teamId}
                assessmentId={match?.params?.assessmentId}
                setTeam={setTeam}
              />
            )}
          />
          <Route
            path={`${path}/analysis/:teamId`}
            render={({ match }) => <AnalysisPersonal teamId={match?.params?.teamId} setTeam={setTeam} />}
          />
        </Switch>
      </div>
    </>
  );
}
