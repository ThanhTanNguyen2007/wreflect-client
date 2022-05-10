import React, { Suspense } from 'react';
import { Layout, Spin } from 'antd';
import { Router, Switch, Redirect, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// const HomePage = React.lazy(() => import('./pages/HomePage/homePage'));
const Team = React.lazy(() => import('./pages/TeamPage/Team'));
const SideBar = React.lazy(() => import('./components/SideBar/sideBar'));
const ActionTracker = React.lazy(() => import('./pages/ActionsTracker/actionsTracker'));
const ManageMembers = React.lazy(() => import('./pages/ManageMembersPage/manageMembers'));
const Board = React.lazy(() => import('./pages/BoardPage/board'));
const AccountSetting = React.lazy(() => import('./pages/AccountSettingPage/accountSetting'));
// const UserManagements = React.lazy(() => import('./components/UserManagements/userManagements'));
const NotFound = React.lazy(() => import('./pages/NotFoundPage/notFound'));
const ManageBoardPage = React.lazy(() => import('./pages/ManageBoardPage/manageBoardPage'));
const HomePage = React.lazy(() => import('./pages/HomePage/homePage'));

// import { HomePage } from './pages/HomePage';
// import { SideBar } from './components/SideBar';
import { User } from './types';
// import { Team } from './pages/TeamPage';
// import { ActionTracker } from './pages/ActionsTracker';
// import { ManageMembers } from './pages/ManageMembersPage';
// import { Board } from './pages/BoardPage';
// import { AccountSetting } from './pages/AccountSettingPage';
// import { UserManagements } from './components/UserManagements';
// import { NotFound } from './pages/NotFoundPage';
// import { ManageBoardPage } from './pages/ManageBoardPage';
// import HealthCheck from './pages/HealthCheck/HealthCheck';
import TeamDetail from './pages/TeamDetailPage/teamDetail';
import { PersonalReflection } from './pages/PersonalReflection';
import NotificationPage from './pages/NotificationPage/notificationList';
import ConnectPage from './pages/ConnectPage/connectPage';
import UserManagementPage from './pages/Admin/UserManagerment/UserManagerment';
import TeamManagerment from './pages/Admin/TeamManagerment/TeamManagerment';
import SystemConfiguration from './pages/Admin/SystemConfiguration/SystemConfiguration';
import AdminPage from './pages/Admin/AdminPage';

const HealthCheck = React.lazy(() => import('./pages/HealthCheck/HealthCheck'));

type Props = {
  me: null | User;
};

const { Content } = Layout;
const customHistory = createBrowserHistory();

const Routes = ({ me }: Props) => {
  const isLoggedIn = !!me?.id;
  const email = me?.email || null;
  const isAdmin = me?.isAdmin || null;
  const picture = me?.picture || null;

  return (
    <Suspense
      fallback={
        <div className="flex flex-ai-c flex-jc-c" style={{ flex: 1, height: '100vh' }}>
          <Spin size="large" />
        </div>
      }
    >
      <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <Router history={customHistory}>
          <Switch>
            {isLoggedIn ? (
              <>
                <SideBar email={email} isAdmin={isAdmin} />
                <Layout className="site-layout flex flex-1">
                  <Content className="flex flex-1" style={{ margin: '10px 16px', padding: '10px', gap: '10px' }}>
                    <Switch>
                      <Route path="/teams" exact component={Team} />
                      <>
                        <Switch>
                          <Route path="/admin">
                            <AdminPage isAdmin={isAdmin} />
                          </Route>
                          <Route path="/personal-reflect" render={({ match }) => <PersonalReflection />} />
                          <Route
                            path="/board/:teamId/:boardId"
                            exact
                            render={({ match }) => (
                              <Board teamId={match.params.teamId} boardId={match.params.boardId} />
                            )}
                          />
                          <Route
                            path="/actions-tracker/:teamId"
                            exact
                            render={({ match }) => <ActionTracker teamId={match.params.teamId} />}
                          />
                          <Route
                            path="/team-health/:teamId/:boardId"
                            exact
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
                            path="/me"
                            exact
                            render={({ match }) => <AccountSetting userId={match.params.userId} />}
                          />
                          <Route path="/connect" exact render={({ match }) => <ConnectPage />} />
                          <Route
                            path="/manage-board/:teamId"
                            render={({ match }) => <ManageBoardPage teamId={match.params.teamId} />}
                          />
                          <Route
                            path="/team-details/:teamId"
                            render={({ match }) => <TeamDetail teamId={match.params.teamId} />}
                          />
                          <Redirect from="/" exact to="/teams" />
                          <Route path="/not-found" component={NotFound} />
                          <Redirect to="/not-found" />
                        </Switch>
                      </>
                    </Switch>
                  </Content>
                  {/* <Footer>
                  <span>wReflect ©2022</span>
                </Footer> */}
                </Layout>
              </>
            ) : (
              <Switch>
                <Route path="/" component={() => <HomePage email={email} picture={picture} />} />
                <Redirect to="/" />
              </Switch>
            )}
          </Switch>
        </Router>
      </Layout>
    </Suspense>
  );
};

export default Routes;
