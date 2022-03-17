import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { TeamQueries } from '../../../grapql-client/queries';
import { Team } from '../../../types';

type Props = {
  teamId: string;
  setTeam: (team: Team) => void;
};

export default function AnalysisPersonal({ teamId, setTeam }: Props) {
  const { data } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  useEffect(() => {
    setTeam(data?.team);
  }, [data]);

  return <div>Analysis</div>;
}
