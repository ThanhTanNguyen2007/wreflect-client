import React, { useContext, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { TopNavBar } from '../../components/TopNavBar';
import { Team } from '../../types';
import AnalysisPersonal from './analysisPersonal';
import ManageJudge from './manageJudge';
import selfContext from '../../contexts/selfContext';
import DoPersonalReflection from './doPersonalReflection';
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
