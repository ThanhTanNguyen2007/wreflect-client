import { COLUMN_FIELDS } from './../fragments/columnFragment';
import { OPINION_FIELDS } from './../fragments/opinionFragments';
import { gql } from '@apollo/client';
import { Board, Column, Opinion } from '../../types';
import { BOARD_FIELDS } from '../fragments/boardFragment';

export type orderOpinionResult = {
  orderOpinion: Board;
};

export type orderOpinionVars = {
  destination: {
    droppableId: string;
    index: number;
  };
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
};

const orderOpinion = gql`
  ${BOARD_FIELDS}
  mutation OrderOpinion($destination: orderOpinion, $source: orderOpinion, $draggableId: String) {
    orderOpinion(destination: $destination, source: $source, draggableId: $draggableId) {
      ...BoardFields
    }
  }
`;

export type convertColumnResult = {
  convertOpinionsInColumn: Column;
};

export type ActionConvertColumn = 'ACTIONS' | 'OPINIONS';

export type convertColumnVars = {
  teamId: string;
  boardId: string;
  columnId: string;
  action: ActionConvertColumn;
};

export const convertColumn = gql`
  mutation ConvertColumn($teamId: String!, $columnId: String!, $action: ActionConvertColumn!, $boardId: String!) {
    convertOpinionsInColumn(teamId: $teamId, columnId: $columnId, action: $action, boardId: $boardId) {
      id
      title
      position
      isActive
      opinions {
        id
        isAction
        responsible
      }
    }
  }
`;

export type emptyColumnResult = {
  emptyColumn: [Opinion];
};

export type emptyColumnVars = {
  teamId: string;
  boardId: string;
  columnId: string;
};

export const emptyColumn = gql`
  ${COLUMN_FIELDS}
  mutation EmptyColumn($columnId: String, $teamId: String!, $boardId: String!) {
    emptyColumn(columnId: $columnId, teamId: $teamId, boardId: $boardId) {
      ...ColumnFields
    }
  }
`;

export { orderOpinion };
