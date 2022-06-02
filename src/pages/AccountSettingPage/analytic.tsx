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

  useEffect(() => {
    setData(
      skillValues?.map((skill) => ({
        type: skill?.criteria?.name,
        sales: skill?.value,
      })),
    );
  }, [skillValues]);

  const config = {
    data,
    xField: 'sales',
    yField: 'type',
    meta: {
      type: {
        alias: 'Type',
      },
      sales: {
        alias: 'Average',
      },
    },
    minBarWidth: 20,
    maxBarWidth: 20,
  };

  return <Bar {...config} />;
}
