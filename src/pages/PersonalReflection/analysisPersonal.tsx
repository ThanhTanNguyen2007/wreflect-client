import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { TeamQueries } from '../../grapql-client/queries';
import { Team } from '../../types';
import { useHistory } from 'react-router-dom';

type Props = {
  teamId: string;
  setTeam: (team: Team) => void;
};

export default function AnalysisPersonal({ teamId, setTeam }: Props) {
  const history = useHistory();

  const { data } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  useEffect(() => {
    setTeam(data?.team);
  }, [data]);

  return (
    <>
      <div>
        <div className="personalSection">
          <div onClick={() => history?.push(`/personal-reflect/manage/${data?.team?.id}`)} className={`manageJudge`}>
            Manage
          </div>
          <div className={`analysis primary`}>Analysis</div>
        </div>
      </div>
      <div className="content">Analysis</div>;
    </>
  );
}
