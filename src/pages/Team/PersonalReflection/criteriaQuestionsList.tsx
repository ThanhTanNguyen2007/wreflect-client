import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { AnswerOnCriteria, Evaluation, Member, Result } from '../../../types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CriteriaQuestion from './criteriaQuestion';
import { point } from '@antv/g2plot';
import _ from 'lodash';
import { CriteriaQueries } from '../../../grapql-client/queries';

type Props = {
  isAllowEdit: boolean;
  member: Member;
  result: Result;
  setResult: (value: Result) => void;
};

export default function CriteriaQuestionsList({
  isAllowEdit,
  member,
  result,
  setResult,
}: // assessmentOnCriteriaList,
Props) {
  const [answerOnCriteriaList, setAnswerOnCriteriaList] = useState<AnswerOnCriteria[]>([]);

  useEffect(() => {
    setAnswerOnCriteriaList(result?.answerOnCriteriaList);
  }, [result]);

  const handleSelected = (value: AnswerOnCriteria) => {
    setResult({
      ...result,
      answerOnCriteriaList: answerOnCriteriaList?.map((answer) => {
        if (value?.id === answer?.id) return value;
        return answer;
      }),
    });
  };

  return (
    <>
      <div className="criteriaQuestionList">
        {answerOnCriteriaList?.map((answer) => {
          return (
            <>
              <CriteriaQuestion
                isAllowEdit={isAllowEdit}
                key={`${answer?.id}`}
                member={member}
                answer={answer}
                setAnswer={(value) => handleSelected(value)}
                // criteriaQuestion={criteriaQuestion}
              />
            </>
          );
        })}
      </div>
    </>
  );
}
