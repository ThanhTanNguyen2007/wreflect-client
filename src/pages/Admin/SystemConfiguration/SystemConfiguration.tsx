import React from 'react';
import { Row, Col, PageHeader, Card } from 'antd';
import HealthCheckConfiguration from '../HealthCheckConfiguration/HealthCheckConfiguration';
import CriteriaConfiguration from '../CriteriaConfiguration/CriteriaConfiguration';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { Switch, Route } from 'react-router-dom';
import AnalysisAdmin from '../Analysis/AnalysisAdmin';

type Props = {
  isAdmin: boolean;
};

const { Meta } = Card;

export default function SystemConfiguration({ isAdmin }: Props) {
  const history = useHistory();
  const { path } = useRouteMatch();

  const handleNavigation = (value: string) => {
    history.push(`${path}/${value}`);
  };

  return (
    <>
      <Switch>
        <Route path={`${path}/health-check`} render={({ match }) => <HealthCheckConfiguration isAdmin={isAdmin} />} />
        <Route path={`${path}/criteria`} render={({ match }) => <CriteriaConfiguration isAdmin={isAdmin} />} />
        <Route
          path={`${path}`}
          exact
          render={() => (
            <>
              <div className="systemConfiguration p-10 scrollable flex flex-dir-c flex-1">
                <PageHeader className="site-page-header flex flex-ai-c flex-jc-c" title="System Configuration" />
                <div>
                  <Row className="flex flex-ai-c flex-jc-c flex-dir-r" gutter={[16, 16]}>
                    <Col span={9}>
                      <Card
                        onClick={() => handleNavigation('health-check')}
                        className="pink mt-25"
                        hoverable
                        cover={<img alt="example" src="/images/healthCheck.jpeg" />}
                      >
                        <Meta
                          title="Health Check Configuration"
                          description="
          You can config all default health check that will show up in Health Check section of entire users"
                        />
                      </Card>
                    </Col>
                    <Col span={9}>
                      <Card
                        onClick={() => handleNavigation('criteria')}
                        className="purple mt-25"
                        hoverable
                        cover={<img alt="example" src="/images/criteria.jpeg" />}
                      >
                        <Meta
                          title="Criteria Configuration"
                          description="You can config all default health check that will show up in Health Check section of entire users"
                        />
                      </Card>
                    </Col>
                    <Col span={9}>
                      <Card
                        className="purple mt-25"
                        hoverable
                        cover={<img alt="example" src="/images/criteria.jpeg" />}
                      >
                        <Meta
                          title="Criteria Configuration"
                          description="You can config all default health check that will show up in Health Check section of entire users"
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </div>
            </>
          )}
        />
      </Switch>
    </>
  );
}
