import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { TopNavBar } from '../../components/TopNavBar';
import { TeamQueries } from '../../grapql-client/queries';
import { Team } from '../../types';
import AnalysisPersonal from './AnalysisPage/analysisPersonal';
import ManageJudge from './Manage/manageJudge';
import queryString from 'query-string';

export default function personalReflectionPage() {
  const [team, setTeam] = useState<Team | null>();
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const [selectedSection, setSelectedSection] = useState(location.pathname.includes('manage') ? 'manage' : 'analysis');

  const handleOnSelectSection = (sectionTitle: string) => {
    setSelectedSection(sectionTitle);
    history.push(`${url}/${sectionTitle}/${team.id}`);
  };

  return (
    <>
      <TopNavBar title="Personal Reflection" team={team} />
      <div className="personalReflectionPage">
        <div className="personalSection">
          <div
            onClick={() => handleOnSelectSection('manage')}
            className={`manageJudge ${selectedSection === 'manage' && 'primary'}`}
          >
            Manage
          </div>
          <div
            onClick={() => handleOnSelectSection('analysis')}
            className={`analysis ${selectedSection === 'analysis' && 'primary'}`}
          >
            Analysis
          </div>
        </div>
        <div className="content">
          <Switch>
            <Route
              path={`${path}/manage/:teamId`}
              exact
              render={({ match }) => <ManageJudge teamId={match.params.teamId} setTeam={setTeam} />}
            />
            <Route
              path={`${path}/analysis/:teamId`}
              render={({ match }) => <AnalysisPersonal teamId={match.params.teamId} setTeam={setTeam} />}
            />
          </Switch>
        </div>
      </div>
    </>
  );
}
