import React, { useEffect, useState } from 'react';
import { Criteria } from '../../types';
import { Rose } from '@ant-design/plots';

type rosePlotChartData = {
  criteria: Criteria;
  sum: number;
  count: number;
  avg: number;
};

type Props = {
  rosePlotData: rosePlotChartData[];
};

export default function RosePlotChart({ rosePlotData }: Props) {
  const [data, setData] = useState<{ criteria: string; avg: number }[]>([]);

  useEffect(() => {
    setData(
      rosePlotData?.map((x) => ({
        criteria: x?.criteria?.name,
        avg: x?.avg,
      })),
    );
  }, [rosePlotData]);

  return (
    <>
      <h2 className="flex flex-ai-c flex-jc-c mb-14">Rose Chart</h2>
      <Rose
        data={data}
        xField="criteria"
        yField="avg"
        seriesField="criteria"
        radius={0.9}
        legend={{
          layout: 'horizontal',
          position: 'bottom',
        }}
        label={{
          content: null,
        }}
      />
    </>
  );
}
