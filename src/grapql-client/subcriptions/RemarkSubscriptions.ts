import { gql } from '@apollo/client';
import { Opinion } from '../../types';
import { OPINION_FIELDS } from '../fragments/opinionFragments';

export type updateOpinionResult = {
  updateOpinion: Opinion;
};

export type updateOpinionVars = {
  opinionId: string;
};

export const updateOpinion = gql`
  ${OPINION_FIELDS}
  subscription UpdateOpinion($opinionId: ID!) {
    updateOpinion(opinionId: $opinionId) {
      ...OpinionFields
    }
  }
`;
