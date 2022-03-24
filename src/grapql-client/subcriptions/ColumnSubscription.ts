import { COLUMN_FIELDS } from './../fragments/columnFragment';
import { gql } from '@apollo/client';
import { Column } from '../../types';

export type subOnUpdateColumnResults = {
  subOnUpdateColumn: Column;
};

export type subOnUpdateColumnVars = {
  meId: string;
  teamId: string;
};

export const subOnUpdateColumn = gql`
  ${COLUMN_FIELDS}
  subscription subOnUpdateColumn($meId: ID!, $teamId: ID!) {
    subOnUpdateColumn(meId: $meId, teamId: $teamId) {
      ...ColumnFields
    }
  }
`;
