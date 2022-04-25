import { Avatar, Badge, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { Evaluation, Member, Result } from '../../types';
import { CheckCircleTwoTone } from '@ant-design/icons';

type Props = {
  member: Member;
  result: Result;
};

export default function AvatarPersonalReflection({ member, result }: Props) {
  return (
    <>
      <Tooltip title={member?.user?.nickname} placement="right">
        <div
          className="flex flex-jc-c flex-ai-c"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
          }}
        >
          <Avatar
            style={{ marginRight: '1px' }}
            size="default"
            shape="circle"
            key={member?.user?.email}
            src={<img src={member?.user?.picture} referrerPolicy="no-referrer" />}
          />
          {result?.answerOnCriteriaList?.every((x) => x?.point) && (
            <div style={{ width: '15px', display: 'flex', flexDirection: 'row-reverse', position: 'absolute' }}>
              <CheckCircleTwoTone style={{ color: '#F79C2D', fontSize: '15px' }} />
            </div>
          )}
        </div>
      </Tooltip>
    </>
  );
}
