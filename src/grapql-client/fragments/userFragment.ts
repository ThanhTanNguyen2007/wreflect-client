import { gql } from '@apollo/client';
export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    createdAt
    updatedAt
    isAdmin
    userStatus
    nickname
    picture
    workplace
    address
    school
    introduction
    talent
    interest
    gender
  }
`;
