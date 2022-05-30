import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Empty } from 'antd';

import { useQuery } from '@apollo/client';
import SearchBar from '../../../components/SearchBar/SearchBar';
import ListMember from '../TeamDetailPage/listMember';
import { TeamQueries } from '../../../grapql-client/queries';
import EditTeamDetailModal from '../TeamDetailPage/editTeamDetailModal';

import { Loading } from '../../../components/Loading';
import { AddTeamMembers } from '.';

import { TopNavBar } from '../../../components/TopNavBar';
import selfContext from '../../../contexts/selfContext';

type Props = {
  teamId: string;
};

export default function MemberManagerment({ teamId }: Props) {
  const [isVisibleEditDetails, setIsVisibleEditDetails] = useState(false);
  const [searchText, setSearchText] = useState('');
  const me = useContext(selfContext);
  const { t } = useTranslation();

  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  return (
    <Loading data={data?.team} loading={loading} error={error}>
      <>
        <TopNavBar iMember={iMember} team={data?.team} title="Manage Members" />
        <div className="scrollable p-10">
          {data && data?.team ? (
            <div className="flex flex-1 flex-dir-r manageMembersPage card mt-10 scrollable">
              <div className="flex-1 manageMembers">
                <div className="mr-10">
                  <SearchBar
                    onHandleSearch={handleSearch}
                    isLoading={loading}
                    placeholder={`${t(`txt_member_find`)}`}
                  />
                </div>
                <div className="mt-25">
                  <ListMember searchText={searchText} teamData={data.team} />
                </div>
              </div>
              <div className="flex-1 addTeamMembers">
                <AddTeamMembers teamData={data.team} />
              </div>
              <EditTeamDetailModal
                isVisible={isVisibleEditDetails}
                teamData={data.team}
                setIsVisible={setIsVisibleEditDetails}
              />
            </div>
          ) : (
            <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
          )}
        </div>
      </>
    </Loading>
  );
}
