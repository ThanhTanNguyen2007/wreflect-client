import React, { useState } from 'react';
import { Button, Card, Tabs } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import TeamsCard from './TeamsCard';
import CreateTeamModal from './createTeamModal';
import SearchBar from '../../components/SearchBar/SearchBar';

const { TabPane } = Tabs;

const Team = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [loading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
    setActiveKey('1');
    setPage(1);
  };

  const operations = (
    <>
      <div className="flex flex-dir-r flex-ai-c flex-jc-c">
        <Button
          type="primary"
          className="mr-10"
          icon={<PlusCircleOutlined />}
          size="middle"
          onClick={() => setIsModalVisible(true)}
        >
          {t('txt_createTeam')}
        </Button>
        <SearchBar placeholder="What are you looking for ?" isLoading={loading} onHandleSearch={onHandleSearch} />
      </div>
    </>
  );

  return (
    <Card className="flex flex-1 highligh">
      <Tabs
        type="card"
        className="tab-inner"
        activeKey={activeKey}
        style={{ height: '100%' }}
        tabBarExtraContent={operations}
        onChange={(key: string) => {
          setActiveKey(key);
        }}
      >
        <TabPane
          tab={
            <div style={activeKey == '1' ? { fontSize: '15px', fontWeight: 'bold' } : { fontSize: '14px' }}>
              {t('txt_all')}
            </div>
          }
          key="1"
          className="flex flex-1"
        >
          <TeamsCard
            setIsLoading={setIsLoading}
            searchText={searchText}
            page={page}
            size={size}
            setSize={setSize}
            setPage={setPage}
          />
        </TabPane>
        <TabPane
          tab={
            <div style={activeKey == '2' ? { fontSize: '15px', fontWeight: 'bold' } : { fontSize: '14px' }}>
              {t(`txt_doing`)}
            </div>
          }
          key="2"
          className="flex flex-1"
        >
          <TeamsCard
            status="DOING"
            setIsLoading={setIsLoading}
            searchText={searchText}
            page={page}
            size={size}
            setSize={setSize}
            setPage={setPage}
          />
        </TabPane>
        <TabPane
          tab={
            <div style={activeKey == '3' ? { fontSize: '15px', fontWeight: 'bold' } : { fontSize: '14px' }}>
              {t('txt_done')}
            </div>
          }
          key="3"
          className="flex flex-1"
        >
          <TeamsCard
            status="DONE"
            setIsLoading={setIsLoading}
            searchText={searchText}
            page={page}
            size={size}
            setSize={setSize}
            setPage={setPage}
          />
        </TabPane>
      </Tabs>

      <CreateTeamModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
    </Card>
  );
};
export default Team;
