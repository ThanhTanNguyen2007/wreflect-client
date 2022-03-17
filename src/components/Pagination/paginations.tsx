import React from 'react';
import _ from 'lodash';
import { Pagination } from 'antd';

type Props = {
  itemsCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (value: number) => void;
};

export default function paginations({ itemsCount, pageSize, currentPage, onPageChange }: Props) {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <div className="flex flex-ai-c flex-jc-c mt-12">
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        total={itemsCount}
        defaultPageSize={8}
        pageSize={pageSize}
        onChange={(page: number) => onPageChange(page)}
      />
    </div>
  );
}
