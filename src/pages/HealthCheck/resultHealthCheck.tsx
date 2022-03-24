import React, { useCallback, useEffect, useState } from 'react';
import { Radar } from '@ant-design/plots';
import { templateHealthCheckType } from '../../const/healthCheckTemplate';
import { HealthCheck, MemberAnswer, MemberComment } from '../../types';

type Props = {
  teamId: string;
  boardId: string;
  selectedTemplate: {
    id: string;
    title: string;
    statements: {
      id: string;
      title: string;
      color: string;
      bad: string;
      good: string;
    }[];
  };
  healthCheckData: {
    getHealthCheck: {
      memberAnswers: [MemberAnswer];
      memberComments: [MemberComment];
      healthCheck: HealthCheck;
    };
  };
};

type data = {
  item: string;
  user?: string;
  value?: number;
};

export default function ResultHealthCheck({ teamId, boardId, selectedTemplate, healthCheckData }: Props) {
  const [data, setData] = useState<data[]>([]);

  useEffect(() => {
    if (healthCheckData?.getHealthCheck?.memberAnswers?.length > 0) {
      const test = [] as { item: string; user: string; value: number }[];
      const memberAnswers = healthCheckData?.getHealthCheck?.memberAnswers;

      memberAnswers?.forEach((memberAnswer) => {
        selectedTemplate?.statements?.forEach((statement) => {
          const data = memberAnswer?.answers?.find((answer) => answer?.questionId === statement?.id);
          if (data) {
            test.push({
              item: statement?.title,
              user: memberAnswer?.member?.user?.nickname,
              value: parseInt(data?.value),
            });
          }
        });
      });

      const avg =
        selectedTemplate?.statements?.map((statement) => {
          return {
            item: statement?.title,
            user: 'Average',
            value:
              test.reduce((prev, cur) => {
                if (cur?.item === statement?.title) {
                  return prev + cur.value;
                }
                return prev;
              }, 0) / memberAnswers?.length,
          };
        }) || [];

      setData([...avg, ...test]);
    } else {
      setData(
        selectedTemplate?.statements?.map((statement) => {
          return {
            item: statement?.title,
          };
        }),
      );
    }
  }, [teamId, boardId, healthCheckData, selectedTemplate]);

  const config = {
    data,
    xField: 'item',
    yField: 'value',
    seriesField: 'user',
    meta: {
      value: {
        alias: '分数',
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
      },
    },
    area: {},
    point: {
      size: 2,
    },
  };

  return <Radar width={600} height={600} {...config} />;
}
