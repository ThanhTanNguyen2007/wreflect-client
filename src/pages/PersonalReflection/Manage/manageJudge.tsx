import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { CriteriaQueries, TeamQueries } from '../../../grapql-client/queries';
import { Team } from '../../../types';
import { Button, Input } from 'antd';
import CreatingAssessmentModal from './CreatingAssessmentModal';

const { Search } = Input;

type Props = {
  teamId: string;
  setTeam: (team: Team) => void;
};

export default function ManageJudge({ teamId, setTeam }: Props) {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModal, setIsVisibleModa] = useState(false);

  const { data: criteriaListData } = useQuery<CriteriaQueries.getListCriteria>(CriteriaQueries.getListCriteria);

  const { data } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  useEffect(() => {
    setTeam(data?.team);
  }, [data]);

  return (
    <div className="manageJudgePage">
      <div className="actionSection">
        <Search />
        <div>
          <Button onClick={() => setIsVisibleModa(true)} type="primary">
            Create Assessment
          </Button>
        </div>
      </div>
      <div className="assessmentContainer"></div>
      <CreatingAssessmentModal
        criteriaData={criteriaListData?.criteriaList}
        team={data?.team}
        isVisible={isVisibleModal}
        setVisible={setIsVisibleModa}
      />
    </div>
  );
}
