import React, { useEffect, useState } from 'react';
import { Criteria } from '../../types';
import { Bullet } from '@ant-design/plots';

type rosePlotChartData = {
  criteria: Criteria;
  sum: number;
  count: number;
  avg: number;
};

type Props = {
  rosePlotData: rosePlotChartData[];
};

export default function GroupedBulletChart({ rosePlotData }: Props) {
  const [data, setData] = useState<
    {
      criteria: string;
      ranges: number[];
      avg: number[];
      target: number;
    }[]
  >([]);

  useEffect(() => {
    setData(
      rosePlotData?.map((x) => ({
        criteria: x?.criteria?.name || '',
        ranges: [1, 4, 5],
        avg: [x?.avg || 0],
        target: 0,
      })) || [],
    );
  }, [rosePlotData]);

  const config = {
    data,
    measureField: 'avg',
    rangeField: 'ranges',
    targetField: 'target',
    xField: 'criteria',
    color: {
      range: ['#FFbcb8', '#FFe0b0', '#bfeec8'],
      avg: '#5B8FF9',
      target: '#39a3f4',
    },
    label: {
      avgs: {
        position: 'middle',
        style: {
          fill: '#fff',
        },
      },
    },
  };

  return (
    <>
      <h2 className="flex flex-ai-c flex-jc-c mb-14">Grouped Bullet Chart</h2>
      <Bullet
        {...config}
        legend={{
          custom: true,
          position: 'bottom',
          items: [
            {
              value: '(0-1)',
              name: '(0-1)',
              marker: {
                symbol: 'square',
                style: {
                  fill: '#FFbcb8',
                  r: 5,
                },
              },
            },
            {
              value: '(1-4)',
              name: '(1-4)',
              marker: {
                symbol: 'square',
                style: {
                  fill: '#FFe0b0',
                  r: 5,
                },
              },
            },
            {
              value: '(4-5)',
              name: '(4-5)',
              marker: {
                symbol: 'square',
                style: {
                  fill: '#bfeec8',
                  r: 5,
                },
              },
            },
            {
              value: 'average point',
              name: 'average point',
              marker: {
                symbol: 'square',
                style: {
                  fill: '#5B8FF9',
                  r: 5,
                },
              },
            },
          ],
        }}
      />
    </>
  );
}
