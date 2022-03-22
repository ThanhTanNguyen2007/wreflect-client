import { gql } from '@apollo/client';
import { Member } from '../../types';
import { MEMBER_FIELDS } from './../fragments/memberFragment';

export type subOnUpdateMemberResult = {
  subOnUpdateMember: Member;
};

export type subOnUpdateMemberVars = {
  teamId: string;
  meetingNote: string;
};

export const subOnUpdateMember = gql`
  ${MEMBER_FIELDS}
  subscription subOnUpdateMember($teamId: String!, $meetingNote: String!) {
    subOnUpdateMember(teamId: $teamId, meetingNote: $meetingNote) {
      ...MemberFields
    }
  }
`;
