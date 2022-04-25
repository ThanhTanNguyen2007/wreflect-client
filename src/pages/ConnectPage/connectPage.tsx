import React, { useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';

export default function ConnectPage() {
  const [searchText, setSearchText] = useState('');
  const [offSet, setOffSet] = useState(0);
  const [limit, setLimit] = useState(10);

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
  };
  return (
    <>
      <div className="flex flex-dir-r">
        <div className="action ">
          <div className="filterBox flex flex-dir-c">
            <SearchBar placeholder="What are you looking for ?" isLoading={false} onHandleSearch={onHandleSearch} />
          </div>
        </div>
        <div className="container"></div>
      </div>
    </>
  );
}
