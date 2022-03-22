import { useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { TopNavBar } from '../../components/TopNavBar';
import { TeamQueries } from '../../grapql-client/queries';
import { Team } from '../../types';
import AnalysisPersonal from './AnalysisPage/analysisPersonal';
import ManageJudge from './Manage/manageJudge';
import queryString from 'query-string';
import { Loading } from '../../components/Loading';
import selfContext from '../../contexts/selfContext';

type Props = {
  teamId: string;
};

export default function personalReflectionPage({ teamId }: Props) {
  const [team, setTeam] = useState<Team | null>();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const me = useContext(selfContext);

  const { data, refetch, error, loading } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: {
        teamId,
      },
    },
  );
  const [selectedSection, setSelectedSection] = useState(location.pathname.includes('manage') ? 'manage' : 'analysis');

  const handleOnSelectSection = (sectionTitle: string) => {
    setSelectedSection(sectionTitle);
    history.push(`${url}/${sectionTitle}/${team.id}`);
  };

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  return (
    <Loading refetch={refetch} data={data?.team} loading={loading} error={error}>
      <>
        <TopNavBar iMember={iMember} title="Personal Reflection" team={team} />
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
    </Loading>
  );
}
