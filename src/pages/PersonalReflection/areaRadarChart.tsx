import React, { useEffect, useState } from 'react';
import { Radar } from '@ant-design/plots';
import { Criteria, Member } from '../../types';

type areaRadarChartData = {
  isSubmit: boolean;
  criteria: Criteria;
  assessor: Member;
  point: number;
};

type Props = {
  areaRadarData: areaRadarChartData[];
};

export default function AreaRadarChart({ areaRadarData }: Props) {
  const [data, setData] = useState<{ criteria: string; point: number; member: string }[]>([]);

  useEffect(() => {
    setData(
      areaRadarData?.map((x) => ({
        criteria: x?.criteria?.name,
        point: x?.point,
        member: x?.assessor?.user?.nickname,
      })),
    );
  }, [areaRadarData]);

  const config = {
    data,
    xField: 'criteria',
    yField: 'point',
    seriesField: 'member',
    meta: {
      point: {
        alias: 'point',
        min: 0,
        max: 5,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    yAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    area: {},
    point: {
      size: 2,
    },
  };

  return (
    <>
      <h2 className="flex flex-ai-c flex-jc-c mb-14">Radar Chart</h2>
      <Radar {...config} />
    </>
  );
}
