import React, { useState } from 'react';
import { Image, Col, Row, Tabs, Modal, Button } from 'antd';
import { QuestionOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'antd';

import { Header } from './../../components/Header';
import { useHistory } from 'react-router-dom';

type Props = {
  redirectUrl?: string;
  email: string | null;
};

const { TabPane } = Tabs;

const HomePage = ({ email, redirectUrl }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  console.log(redirectUrl);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header email={email} />
      <div className="home-page">
        <Row>
          <Col style={{ paddingTop: 70 }} span={8}>
            <h1 style={{ fontSize: 40 }}>{t(`txt_homepage_title_1`)}</h1>
            <p style={{ color: 'gray', letterSpacing: 1 }}>
              {t(`txt_homepage_content_retrospective_1`)} <b>{t(`txt_homepage_content_retrospective_2`)}</b>{' '}
              {t`txt_homepage_content_retrospective_3`}
            </p>
          </Col>
          <Col span={8}>
            <Image preview={false} src="/images/teamwork-gif1.gif" height={330} style={{ objectFit: 'cover' }} />
          </Col>
        </Row>
        <div className="height-30" />
        <Row>
          <Col style={{ padding: 15, textAlign: 'center', marginTop: 20 }} span={20}>
            <h1 style={{ fontSize: 40 }}>{t(`txt_homepage_title_6`)}</h1>
            <p style={{ color: 'gray', letterSpacing: 1 }}>
              <b>{t(`txt_homepage_content_retrospective_1`)}</b> {t(`txt_homepage_content_retrospective_2`)}{' '}
              {t(`txt_homepage_content_retrospective_3`)}
            </p>
          </Col>
        </Row>
        <div className="height-30" />
        <Row>
          <Col span={8}>
            <Image preview={false} src="/images/teamwork-gif2.gif" height={390} style={{ objectFit: 'cover' }} />
          </Col>
          <Col style={{ paddingTop: 70 }} span={8}>
            <h1 style={{ fontSize: 40 }}>{t(`txt_homepage_title_2`)}</h1>
            <p style={{ color: 'gray', letterSpacing: 1 }}>
              {t(`txt_homepage_content_why_1`)} <b>{t(`txt_homepage_content_retrospective_1`)}</b>{' '}
              {t(`txt_homepage_content_why_2`)}
            </p>
          </Col>
        </Row>
        <div className="height-30" />
        <Row style={{ marginBottom: 20 }}>
          <Col style={{ textAlign: 'center', padding: 40 }} span={24}>
            <div style={{ padding: '0px 40px' }}>
              <h1 style={{ fontSize: 40, marginBottom: 10, background: '#f7f7f7' }}>{t(`txt_homepage_title_3`)} </h1>
            </div>
            <Carousel
              style={{
                color: 'gray',
                letterSpacing: 1,
                textAlign: 'center',
                padding: 50,
              }}
            >
              <div>
                <b>{t(`txt_homepage_content_with_member`)}</b>
                <p>
                  {t(`txt_homepage_content_evaluate_1`)} {` `}
                  {t(`txt_homepage_content_evaluate_3`)}
                </p>
              </div>
              <div>
                <b> {t(`txt_homepage_content_with_reflection_board`)}</b>
                <p>{t(`txt_homepage_content_evaluate_4`)}</p>
              </div>
              <div>
                <b>{t(`txt_homepage_content_with_action_tracker`)}</b>
                <p>{t(`txt_homepage_content_evaluate_5`)}</p>
              </div>
              <div>
                <b> {t(`txt_homepage_content_with_personal_profile`)}</b>
                <p>{t(`txt_homepage_content_evaluate_6`)}</p>
              </div>
              <div>
                <b> {t(`txt_homepage_content_with_searching_profile`)}</b>
                <p>{t(`txt_homepage_content_evaluate_7`)}</p>
              </div>
            </Carousel>
          </Col>
          <Col style={{ marginBottom: 5, textAlign: 'center', padding: 40 }} span={24}>
            <div style={{ padding: '0px 40px' }}>
              <h1 style={{ fontSize: 40, marginBottom: 10, background: '#f7f7f7' }}>{t(`txt_homepage_title_4`)} </h1>
            </div>
            <Carousel
              style={{
                color: 'gray',
                letterSpacing: 1,
                textAlign: 'center',
                padding: 50,
              }}
              autoplay
            >
              <div>
                <b> {t(`txt_homepage_content_with_member`)}</b>
                <p>{t(`txt_homepage_content_evaluate_8`)}</p>
              </div>
              <div>
                <b>{t(`txt_homepage_content_with_reflection_board`)}</b>
                <p>{t(`txt_homepage_content_evaluate_9`)}</p>
              </div>
              <div>
                <b> {t(`txt_homepage_content_with_action_tracker`)}</b>
                <p>{t(`txt_homepage_content_evaluate_10`)}</p>
              </div>
              <div>
                <b> {t(`txt_homepage_content_with_health_check`)}</b>
                <p>{t(`txt_homepage_content_evaluate_11`)}</p>
              </div>
              <div>
                <b>{t(`txt_homepage_content_with_personal_reflection`)}</b>
                <p>{t(`txt_homepage_content_evaluate_12`)}</p>
              </div>
              <div>
                <b> {t(`txt_homepage_content_with_personal_profile`)}</b>
                <p>{t(`txt_homepage_content_evaluate_13`)}</p>
              </div>
              <div>
                <b>{t(`txt_homepage_content_with_searching_profile`)}</b>
                <p>{t(`txt_homepage_content_evaluate_14`)}</p>
              </div>
            </Carousel>
          </Col>
        </Row>

        <div className="height-30" />
        <Row>
          <Col style={{ padding: 15 }} span={9}>
            <h1 style={{ fontSize: 40 }}>{t(`txt_homepage_title_5`)}</h1>
            <p style={{ color: 'gray', letterSpacing: 1 }}>
              {t(`txt_homepage_content_evaluate_15`)} <b>{t(`txt_homepage_content_evaluate_16`)}</b>{' '}
              {t(`txt_homepage_content_evaluate_17`)}
              {` `}
              <b>{t(`txt_homepage_content_evaluate_18`)}</b>. {` `}
              {t(`txt_homepage_content_evaluate_19`)}
            </p>
            <div className="button-home-page">
              <a href="https://dev-m0ubghav.us.auth0.com/u/signup?state=hKFo2SA1MGI3VTFwWGs0Q2h3MjhUNWZjcXhPVjB1eFhZRzR3eaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEwxRUNyNGd5eFNCUVRaeUtScnFpS0k0UTJnTjVnalVOo2NpZNkgY09LQTFUWXN3V0YwU3R1bkpLT2p0MXY0T0JWV1R0dEE">
                <Button shape="round" type="primary" icon={<UserOutlined />} style={{ marginRight: 20 }}>
                  Sign Up
                </Button>
              </a>
              <Button shape="round" type="dashed" icon={<QuestionOutlined />} onClick={handleShowModal}>
                {t(`txt_homepage_content_tutorial`)}
              </Button>
            </div>
          </Col>
          <Col span={8}>
            <Image preview={false} src="/images/teamwork-gif3.gif" height={360} style={{ objectFit: 'cover' }} />
          </Col>

          <Modal className="modal-userguide" title="User Guide" visible={showModal} onCancel={handleCancel}>
            <Row>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Create Team" key="1">
                  <iframe width="950" height="350" src="https://www.youtube.com/embed/G6C0enWSx-Q/"></iframe>
                </TabPane>
                <TabPane tab="Add member" key="2">
                  <iframe width="950" height="350" src="https://www.youtube.com/embed/eSSS5c9K4yw"></iframe>
                </TabPane>
                <TabPane tab="Do Reflect" key="3">
                  <iframe width="950" height="350" src="https://www.youtube.com/embed/QDSBj48JwRw/"></iframe>
                </TabPane>
              </Tabs>
            </Row>
          </Modal>
        </Row>
      </div>
    </>
  );
};

export default HomePage;
