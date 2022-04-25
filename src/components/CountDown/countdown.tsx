import moment from 'moment';
import React, { useEffect, useState } from 'react';

type Props = {
  startTime: number;
  endTime: number;
};

export default function Countdown({ startTime, endTime }: Props) {
  const [duration, setDuration] = useState<moment.Duration>();

  useEffect(() => {
    const diffTime = endTime - moment().valueOf();
    setDuration(moment.duration(diffTime, 'milliseconds'));
  }, [endTime, startTime]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDuration(moment.duration(duration.asMilliseconds() - 1000, 'milliseconds'));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [duration]);

  if (duration?.milliseconds() <= 0) return <div>00:00:00</div>;

  return (
    <>
      {`${duration?.days() ? duration?.days() + ' day(s)' : ''}
      ${duration?.hours() / 10 < 1 ? '0' + duration?.hours() : duration?.hours()}:${
        duration?.minutes() / 10 < 1 ? '0' + duration?.minutes() : duration?.minutes()
      }:${duration?.seconds() / 10 < 1 ? '0' + duration?.seconds() : duration?.seconds()}`}
    </>
  );
}
