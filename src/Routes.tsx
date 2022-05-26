import React, { Suspense } from 'react';
import { Layout, Spin } from 'antd';
import { Router, Switch, Redirect, Route, BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// const HomePage = React.lazy(() => import('./pages/HomePage/homePage'));
// const Team = React.lazy(() => import('./pages/TeamPage/Teams'));
// const SideBar = React.lazy(() => import('./components/SideBar/sideBar'));
// const ActionTracker = React.lazy(() => import('./pages/Team/ActionsTracker/actionsTracker'));
// const ManageMembers = React.lazy(() => import('./pages/Team/ManageMembersPage/manageMembers'));
// const Board = React.lazy(() => import('./pages/Team/BoardPage/board'));
// const AccountSetting = React.lazy(() => import('./pages/AccountSettingPage/accountSetting'));
// const UserManagements = React.lazy(() => import('./components/UserManagements/userManagements'));
// const NotFound = React.lazy(() => import('./pages/NotFoundPage/notFound'));
// const ManageBoardPage = React.lazy(() => import('./pages/Team/ManageBoardPage/manageBoardPage'));
// const HomePage = React.lazy(() => import('./pages/HomePage/homePage'));

import { HomePage } from './pages/HomePage';
import { SideBar } from './components/SideBar';
import { User } from './types';
import { Team } from './pages/TeamPage';
import { ActionTracker } from './pages/Team/ActionsTracker';
import { ManageMembers } from './pages/Team/ManageMembersPage';
import { Board } from './pages/Team/BoardPage';
import { AccountSetting } from './pages/AccountSettingPage';
import { NotFound } from './pages/NotFoundPage';
import { ManageBoardPage } from './pages/Team/ManageBoardPage';
import HealthCheck from './pages/Team/HealthCheck/HealthCheck';
import TeamDetail from './pages/Team/TeamDetailPage/teamDetail';
import { PersonalReflection } from './pages/Team/PersonalReflection';
import NotificationPage from './pages/NotificationPage/notificationList';
import UserManagementPage from './pages/Admin/UserManagerment/UserManagerment';
import TeamManagerment from './pages/Admin/TeamManagerment/TeamManagerment';
import SystemConfiguration from './pages/Admin/SystemConfiguration/SystemConfiguration';
import AdminPage from './pages/Admin/AdminPage';
import InvitePage from './pages/InvitePage/InvitePage';
// import { useRouteMatch } from 'react-router-dom';

type Props = {
  me: null | User;
};

const { Content } = Layout;
// const customHistory = createBrowserHistory();

const Routes = ({ me }: Props) => {
  const isLoggedIn = !!me?.id;
  console.log(me?.id);
  // const isLoggedIn = true;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;
  const picture = me?.picture || null;
  // const { path } = useRouteMatch();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex flex-ai-c flex-jc-c" style={{ flex: 1, height: '100vh' }}>
            <Spin size="large" />
          </div>
        }
      >
        <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
          <BrowserRouter>
            {!!isLoggedIn ? (
              <>
                <SideBar email={email} isAdmin={isAdmin} />
                <Layout className="site-layout flex flex-1 non-scroll">
                  <Content className="flex flex-1" style={{ padding: '10px 10px 0px 20px', gap: '10px' }}>
                    <Switch>
                      <Route path="/teams" component={Team} />
                      <Redirect from="/" exact to="/teams" />
                      <Route path="/admin">
                        <AdminPage isAdmin={isAdmin} />
                      </Route>
                      <Route
                        path="/invite-link/:teamId"
                        exact
                        render={({ match }) => <InvitePage teamId={match?.params?.teamId} />}
                      />
                      <Route path="/personal-reflect" render={({ match }) => <PersonalReflection />} />
                      <Route
                        path="/reflect/:teamId/:boardId"
                        render={({ match }) => <Board teamId={match.params.teamId} boardId={match.params.boardId} />}
                      />
                      <Route
                        path="/actions-tracker/:teamId"
                        exact
                        render={({ match }) => <ActionTracker teamId={match.params.teamId} />}
                      />
                      <Route
                        path="/team-health/:teamId/:boardId"
                        render={({ match }) => (
                          <HealthCheck teamId={match.params.teamId} boardId={match.params.boardId} />
                        )}
                      />
                      <Route
                        path="/manage-members/:teamId"
                        render={({ match }) => <ManageMembers teamId={match.params.teamId} />}
                      />
                      <Route path="/notifications" exact render={({ match }) => <NotificationPage />} />
                      <Route
                        path="/profile/me"
                        render={({ match }) => <AccountSetting userId={match.params.userId} />}
                      />
                      <Route
                        path="/manage-board/:teamId"
                        render={({ match }) => <ManageBoardPage teamId={match.params.teamId} />}
                      />
                      <Route
                        path="/team-details/:teamId"
                        render={({ match }) => <TeamDetail teamId={match.params.teamId} />}
                      />
                      <Route path="/not-found" component={NotFound} />
                      <Redirect to="/not-found" />
                    </Switch>
                  </Content>
                  {/* <Footer>
                  <span>wReflect ©2022</span>
                </Footer> */}
                </Layout>
              </>
            ) : (
              <Switch>
                <Route
                  path="/"
                  exact
                  render={({ location }: { location: any }) => (
                    <>
                      <HomePage redirectUrl={location?.state?.from} email={email} picture={picture} />
                    </>
                  )}
                />
                <Redirect
                  path="/"
                  to={{
                    pathname: '/',
                    state: { from: `${location.pathname}` },
                  }}
                />
              </Switch>
            )}
          </BrowserRouter>
        </Layout>
      </Suspense>
    </>
  );
};

export default Routes;
