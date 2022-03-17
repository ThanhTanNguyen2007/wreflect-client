import { gql } from '@apollo/client';

const updateUser = gql`
  mutation updateUser($picture: String) {
    updateUser(picture: $picture) {
      id
      email
      createdAt
      updatedAt
      isAdmin
      userStatus
    }
  }
`;
export { updateUser };
