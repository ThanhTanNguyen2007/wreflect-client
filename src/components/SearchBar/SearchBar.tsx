import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

type Props = {
  placeholder: string;
  isLoading: boolean;
  onHandleSearch(searchValue: string): void;
  searchTextDefault?: string;
  style?: React.CSSProperties;
};

const SearchBar = ({ searchTextDefault, style, placeholder, isLoading, onHandleSearch }: Props) => {
  const [searchText, setSearchText] = useState<string>();

  const handleSearchChange = (searchValue: string) => {
    onHandleSearch(searchValue);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === '') {
      handleSearchChange('');
    }
    setSearchText(e.currentTarget.value);
  };

  useEffect(() => {
    if (searchTextDefault) {
      setSearchText(searchTextDefault);
    }
  }, []);

  return (
    <Search
      placeholder={placeholder}
      bordered
      style={style}
      value={searchText}
      allowClear={true}
      loading={isLoading}
      onChange={(e) => handleOnChange(e)}
      onPressEnter={(e) => handleSearchChange(e.currentTarget.value)}
      onSearch={handleSearchChange}
      enterButton
    />
  );
};

export default SearchBar;
