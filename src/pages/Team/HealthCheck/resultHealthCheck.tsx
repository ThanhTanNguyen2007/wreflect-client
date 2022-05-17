import React, { useCallback, useEffect, useState } from 'react';
import { Radar } from '@ant-design/plots';
import { templateHealthCheckType } from '../../../const/healthCheckTemplate';
import { HealthCheck, MemberAnswer, MemberComment, Team, Template } from '../../../types';

type Props = {
  team: Team;
  numOfMembersDoHealthCheck: number;
  teamId: string;
  boardId: string;
  selectedTemplate: Template;
  healthCheck: HealthCheck;
};
type data = {
  item: string;
  user?: string;
  value?: number;
};

export default function ResultHealthCheck({
  team,
  teamId,
  boardId,
  numOfMembersDoHealthCheck,
  selectedTemplate,
  healthCheck,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<data[]>(
    selectedTemplate?.healthCheckQuestions?.map((question) => ({
      item: question?.title,
    })) || [],
  );

  useEffect(() => {
    if (healthCheck?.memberOnHealthCheck?.length > 0) {
      (async () => {
        const resultOfMembers = healthCheck?.memberOnHealthCheck?.map((x) => ({
          item: x?.question?.title,
          user: x?.member?.user?.nickname,
          value: x?.point,
        }));

        const avg =
          selectedTemplate?.healthCheckQuestions?.map((statement) => {
            return {
              item: statement?.title,
              user: 'Average',
              value:
                resultOfMembers.reduce((prev, cur) => {
                  if (cur?.item === statement?.title) {
                    return prev + cur.value;
                  }
                  return prev;
                }, 0) / numOfMembersDoHealthCheck,
            };
          }) || [];
        await Promise.all([resultOfMembers, avg]);
        setData([...avg, ...resultOfMembers]);
      })();
    } else {
      setData(
        selectedTemplate?.healthCheckQuestions?.map((question) => ({
          item: question?.title,
        })),
      );
    }
    setIsLoading(false);
  }, [teamId, boardId, healthCheck, selectedTemplate, numOfMembersDoHealthCheck]);

  const config = {
    data,
    xField: 'item',
    yField: 'value',
    seriesField: 'user',
    meta: {
      value: {
        alias: 'Point Of Question',
        min: 0,
        max: 5,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      animate: false,
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
      animate: false,
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
    plotOptions: {
      series: {
        animation: false,
      },
    },
  };

  return (
    <div id="chartContainer" style={{ position: 'relative' }}>
      <Radar
        loading={isLoading}
        legend={{
          selected: {
            Average: true,
            ...team?.members?.map((x) => x?.user?.nickname).reduce((arr, curr) => ((arr[curr] = false), arr), {}),
          },
        }}
        width={600}
        height={600}
        {...config}
      />
    </div>
  );
}
