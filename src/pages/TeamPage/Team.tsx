import React, { useState } from 'react';
import { Button, Tabs } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
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

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
    setActiveKey('1');
    setPage(1);
  };

  const operations = (
    <>
      <div className="flex flex-dir-r flex-ai-c flex-jc-c">
        <Button className="mr-10" icon={<PlusCircleOutlined />} size="middle" onClick={() => setIsModalVisible(true)}>
          New Team
        </Button>
        <SearchBar placeholder="What are you looking for ?" isLoading={loading} onHandleSearch={onHandleSearch} />
      </div>
    </>
  );

  return (
    <div className="flex-1 site-layout-background card" style={{ padding: 24 }}>
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
        <TabPane tab="All" key="1" className="flex flex-1">
          <TeamsCard
            setIsLoading={setIsLoading}
            searchText={searchText}
            page={page}
            size={size}
            setSize={setSize}
            setPage={setPage}
          />
        </TabPane>
        <TabPane tab="Doing" key="2" className="flex flex-1">
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
        <TabPane tab="Done" key="3" className="flex flex-1">
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
    </div>
  );
};
export default Team;
