import { Card } from 'antd';
import React from 'react';

type Props = {
  isAdmin: boolean;
};

export default function AnalysisAdmin({ isAdmin }: Props) {
  return (
    <div className="flex flex-1">
      <Card className="flex flex-1">hi</Card>
    </div>
  );
}
