import React, { useEffect, useState } from 'react';
import { Bar } from '@ant-design/plots';
import { UserOnCriteria } from '../../types';

type Props = {
  skillValues: UserOnCriteria[];
};

type data = {
  type: string;
  sales: number;
}[];

export default function AnalyticComponent({ skillValues }: Props) {
  const [data, setData] = useState<data>([]);
  console.log('??', skillValues);

  useEffect(() => {
    setData(
      skillValues?.map((skill) => ({
        type: skill?.criteria?.name,
        sales: skill?.value,
      })),
    );
  }, [skillValues]);

  //   const config = {
  //     data,
  //     xField: 'avg',
  //     yField: 'criteria',
  //     meta: {
  //       criteria: {
  //         alias: '??',
  //       },
  //       avg: {
  //         alias: '销售额',
  //       },
  //     },
  //     minBarWidth: 20,
  //     maxBarWidth: 20,
  //   };

  //   const data = [
  //     {
  //       type: '家具家电',
  //       sales: 38,
  //     },
  //     {
  //       type: '粮油副食',
  //       sales: 52,
  //     },
  //     {
  //       type: '生鲜水果',
  //       sales: 61,
  //     },
  //     {
  //       type: '美容洗护',
  //       sales: 145,
  //     },
  //     {
  //       type: '母婴用品',
  //       sales: 48,
  //     },
  //     {
  //       type: '进口食品',
  //       sales: 38,
  //     },
  //     {
  //       type: '食品饮料',
  //       sales: 38,
  //     },
  //     {
  //       type: '家庭清洁',
  //       sales: 38,
  //     },
  //   ];
  const config = {
    data,
    xField: 'sales',
    yField: 'type',
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
    minBarWidth: 20,
    maxBarWidth: 20,
  };

  return <Bar {...config} />;
}
