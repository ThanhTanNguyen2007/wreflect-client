import { Button } from 'antd';
import React, { useState } from 'react';
import { Loading } from '../../../components/Loading';
import SearchBar from '../../../components/SearchBar/SearchBar';

export default function ListHealthCheckDefault() {
  const [searchText, setSearchText] = useState('');

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <div className="container">
      <Loading data={''} loading={false}>
        <>
          <div className="action flex flex-dir-r flex-gap-10">
            <div className="filterBox flex flex-1 flex-dir-c">
              <SearchBar placeholder="What are you looking for ?" isLoading={false} onHandleSearch={onHandleSearch} />
            </div>
            <Button> Create</Button>
          </div>
          <div className="listItem"></div>
        </>
      </Loading>
    </div>
  );
}
