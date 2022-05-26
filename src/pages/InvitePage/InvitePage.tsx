import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { TeamQueries } from '../../grapql-client/queries';
import { checkInviteTeamResult, checkInviteTeamVars } from '../../grapql-client/queries/TeamQueries';
import selfContext from '../../contexts/selfContext';
import { Button, notification } from 'antd';
import { TeamMutations } from '../../grapql-client/mutations';
import { joinTeamWithLinkResult, joinTeamWithLinkVars } from '../../grapql-client/mutations/TeamMutations';

type Props = {
  teamId: string;
};

export default function InvitePage({ teamId }: Props) {
  const history = useHistory();
  const me = useContext(selfContext);
  //   const [checkInviteLink] = useLazyQuery<checkInviteTeamResult, checkInviteTeamVars>(TeamQueries?.checkInviteTeam);
  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: {
        teamId,
      },
      fetchPolicy: 'cache-and-network', // Used for first execution
      nextFetchPolicy: 'cache-only',
    },
  );

  const [joinLink, { loading: isJoining }] = useMutation<joinTeamWithLinkResult, joinTeamWithLinkVars>(
    TeamMutations?.joinTeamWithLink,
    {
      onCompleted: () => {
        history?.push(`/reflect/${teamId}/${data?.team?.boards[0].id}`);
      },
      onError: () => {
        notification?.error({
          message: error?.message,
          placement: 'bottomRight',
        });
      },
    },
  );

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  return (
    <div className="flex flex-1 flex-dir-c flex-ai-c flex-jc-c">
      {!!iMember ? (
        <>
          <h2>You are already joined Team</h2>
          <Button className="mt-10" onClick={() => history?.push(`/reflect/${teamId}/${data?.team?.boards[0].id}`)}>
            Back to Team
          </Button>
        </>
      ) : (
        <>
          <h2>{`Do you want to join to team "${data?.team?.name}"`}</h2>
          <div className="flex mt-10 flex-dir-r flex-gap-10">
            <Button>Cancel</Button>
            <Button
              loading={isJoining}
              onClick={() =>
                joinLink({
                  variables: {
                    teamId,
                  },
                })
              }
              type="primary"
            >
              Join
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
