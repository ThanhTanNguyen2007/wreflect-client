import React, { useEffect, useState } from 'react';

import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Gif } from '@giphy/react-components';
import config from '../../../config';

const giphyFetch = new GiphyFetch(config.GIPHY_API);

export default function GenerateGif() {
  const [gif, setGif] = useState<IGif | null>();

  useEffect(() => {
    (async () => {
      const { data } = await giphyFetch.gif('fpXxIjftmkk9y');
      setGif(data);
    })();
  }, []);

  return <div>{gif && <Gif gif={gif} width={200} />}</div>;
}
