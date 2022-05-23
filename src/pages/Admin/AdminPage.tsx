import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HealthCheckConfiguration from './HealthCheckConfiguration/HealthCheckConfiguration';
import CriteriaConfiguration from './CriteriaConfiguration/CriteriaConfiguration';
import SystemConfiguration from './SystemConfiguration/SystemConfiguration';
import TeamManagerment from './TeamManagerment/TeamManagerment';
import UserManagementPage from './UserManagerment/UserManagerment';
import AnalysisAdmin from './Analysis/AnalysisAdmin';

type Props = {
  isAdmin: boolean;
};

export default function AdminPage({ isAdmin }: Props) {
  return (
    <>
      {isAdmin ? (
        <Switch>
          <Route path="/admin/user-managerment" render={({ match }) => <UserManagementPage isAdmin={isAdmin} />} />
          <Route path="/admin/team-managerment" render={({ match }) => <TeamManagerment isAdmin={isAdmin} />} />
          <Route path={`/admin/analysis`} render={({ match }) => <AnalysisAdmin isAdmin={isAdmin} />} />
          <Route
            path="/admin/variables-configuration"
            render={({ match }) => <SystemConfiguration isAdmin={isAdmin} />}
          />
          <Redirect from="/admin" to="/admin/user-managerment" />
        </Switch>
      ) : (
        <h2 className="bold flex flex-1 flex-ai-c flex-jc-c">
          Sorry, you need Admin permission to access this site. Thanks
        </h2>
      )}
    </>
  );
}
