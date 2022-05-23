import React from 'react';
import { Badge } from 'antd';

type Props = {
  children: JSX.Element;
  isVisible: boolean;
  title: string;
};

export default function BadgeComponent({ children, isVisible, title }: Props) {
  return <>{isVisible ? <Badge.Ribbon text={title}>{children}</Badge.Ribbon> : <>{children}</>} </>;
}
