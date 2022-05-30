import React, { useState } from 'react';
import { Image, Col, Row, Tabs, Modal, Button } from 'antd';
import { QuestionOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import auth0, { AuthOptions } from 'auth0-js';

import { Header } from './../../components/Header';
import config from '../../config';

type Props = {
  email: string | null;
  picture: string | null;
};

const { TabPane } = Tabs;

const HomePage = ({ email, picture }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const authConfig: AuthOptions = config.AUTH0_WEBAUTH_CONFIG;

  const webAuth = new auth0.WebAuth(authConfig);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header email={email} picture={picture} />
      <div className="home-page">
        <Row>
          <Col style={{ paddingTop: 70 }} span={8}>
            <h1 style={{ fontSize: 40 }}>{t(`txt_homepage_title_1`)}</h1>
            <p style={{ color: 'gray', letterSpacing: 1 }}>
              {t(`txt_homepage_content_retrospective_1`)} <b>{t(`txt_homepage_content_retrospective_2`)}</b>{' '}
              {t`txt_homepage_content_retrospective_3`}
            </p>
          </Col>
          <Col span={10}>
            <Image preview={false} src="/images/teamwork-gif1.gif" height={330} style={{ objectFit: 'cover' }} />
          </Col>
        </Row>
        <div className="height-30" />
        <Row>
          <Col style={{ padding: 15, textAlign: 'center', marginTop: 20 }} span={24}>
            <h1 style={{ fontSize: 40 }}>{t(`txt_homepage_title_6`)}</h1>
            <p style={{ color: 'gray', letterSpacing: 1 }}>
              <b>{t(`txt_homepage_content_retrospective_1`)}</b>
              {''}
              {t(`txt_homepage_content_retrospective_2`)} {t(`txt_homepage_content_retrospective_3`)}
            </p>
          </Col>
        </Row>
        <div className="height-30" />
        <Row>
          <Col span={10}>
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
        <Row>
          <Col style={{ padding: 15 }} span={24}>
            <h1 style={{ fontSize: 40, textAlign: 'center' }}>GIÁ TRỊ CỦA wREFLECT ĐEM LẠI CHO CÁ NHÂN ? </h1>
            <div style={{ color: 'gray', letterSpacing: 1 }}>
              <p>
                <b>- {t(`txt_homepage_content_with_member`)}</b> : {t(`txt_homepage_content_evaluate_1`)}{' '}
                {t(`txt_homepage_content_evaluate_3`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_reflection_board`)}</b> : {t(`txt_homepage_content_evaluate_4`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_action_tracker`)}</b> : {t(`txt_homepage_content_evaluate_5`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_personal_profile`)}</b> : {t(`txt_homepage_content_evaluate_6`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_searching_profile`)}</b> : {t(`txt_homepage_content_evaluate_7`)}
              </p>
            </div>
          </Col>
        </Row>
        <div className="height-30" />
        <Row>
          <Col style={{ padding: 15 }} span={24}>
            <h1 style={{ fontSize: 40, textAlign: 'center' }}>{t(`txt_homepage_title_4`)} </h1>
            <div style={{ color: 'gray', letterSpacing: 1 }}>
              <p>
                <b>- {t(`txt_homepage_content_with_member`)}</b> : {t(`txt_homepage_content_evaluate_8`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_reflection_board`)}</b> :{t(`txt_homepage_content_evaluate_9`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_action_tracker`)}</b> :{t(`txt_homepage_content_evaluate_10`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_health_check`)}</b> : {t(`txt_homepage_content_evaluate_11`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_personal_reflection`)}</b> : {t(`txt_homepage_content_evaluate_12`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_personal_profile`)}</b> : {t(`txt_homepage_content_evaluate_13`)}
              </p>
              <p>
                <b>- {t(`txt_homepage_content_with_searching_profile`)}</b> : {t(`txt_homepage_content_evaluate_14`)}
              </p>
            </div>
          </Col>
        </Row>
        <div className="height-30" />
        <Row>
          <Col style={{ padding: 15 }} span={11}>
            <h1 style={{ fontSize: 40 }}>TÓM LẠI</h1>
            <p style={{ color: 'gray', letterSpacing: 1 }}>
              {t(`txt_homepage_content_evaluate_15`)} <b>{t(`txt_homepage_content_evaluate_16`)}</b>{' '}
              {t(`txt_homepage_content_evaluate_17`)}
              {` `}
              <b>{t(`txt_homepage_content_evaluate_18`)}</b>. {` `}
              {t(`txt_homepage_content_evaluate_19`)}
            </p>
            <div className="button-home-page">
              <Button
                onClick={() =>
                  webAuth.authorize({
                    mode: 'signUp',
                  })
                }
                shape="round"
                type="primary"
                icon={<UserOutlined />}
                style={{ marginRight: 20 }}
              >
                Sign Up
              </Button>
              <Button shape="round" type="dashed" icon={<QuestionOutlined />} onClick={handleShowModal}>
                {t(`txt_homepage_content_tutorial`)}
              </Button>
            </div>
          </Col>
          <Col span={10}>
            <Image preview={false} src="/images/teamwork-gif3.gif" height={400} style={{ objectFit: 'cover' }} />
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
