import moment from 'moment';
import React, { useEffect, useState } from 'react';

type Props = {
  endTime: string;
};

export default function Countdown({ endTime }: Props) {
  const diffTime = moment(+endTime).valueOf() - moment().valueOf();
  const [duration, setDuration] = useState(moment.duration(diffTime, 'milliseconds'));

  useEffect(() => {
    console.log(endTime);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDuration(moment.duration(duration.asMilliseconds() - 1000, 'milliseconds'));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [duration]);

  if (duration.milliseconds() <= 0) return <div>00:00:00</div>;

  return (
    <>{`${duration?.hours() / 10 < 1 ? '0' + duration.hours() : duration.hours()}:
    ${duration?.minutes() / 10 < 1 ? '0' + duration.minutes() : duration.minutes()}:${
      duration?.seconds() / 10 < 1 ? '0' + duration.seconds() : duration.seconds()
    }`}</>
  );
}
