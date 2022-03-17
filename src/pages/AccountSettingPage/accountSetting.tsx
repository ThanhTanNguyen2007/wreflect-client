import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';

import { UserMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

import { user } from '../../apis';

const AccountSetting = () => {
  const me = useContext(SelfContext);
  const [updateAcctount] = useMutation(UserMutations.updateUser, {});

  const handleFinish = (values: any) => {
    updateAcctount({ variables: { picture: values['email'] } });
    user.me();
  };

  return (
    <div className="profileUser">
      <div className="headerSection">
        </div>
        <div>
          
        </div>
    </div>
  );
};

export default AccountSetting;
