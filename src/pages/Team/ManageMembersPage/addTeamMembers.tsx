import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TweenOneGroup } from 'rc-tween-one';
import { Form, notification, message, Button, FormInstance, Input, Tag, Switch, Tooltip } from 'antd';
import { useMutation } from '@apollo/client';
import { MemberMutations, TeamMutations } from '../../../grapql-client/mutations';
import { TeamQueries } from '../../../grapql-client/queries';
import { UserAddOutlined, CheckOutlined, SendOutlined, CopyOutlined, CloseOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Team } from '../../../types';
import config from '../../../config';

const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

type Props = {
  team?: Team;
};

type listStatusAddMembers = {
  success: string[];
  warnings: string[];
  errors: string[];
};

const showNotification = (data: listStatusAddMembers) => {
  const { success, warnings, errors } = data;
  success.map((suc: string) => {
    // message.success(suc);
    notification.success({ message: suc, placement: 'bottomRight' });
  });
  warnings.map((warn: string) => {
    // message.info(warn);
    notification.info({
      message: warn,
      placement: 'bottomRight',
    });
  });
  errors.map((error: string) => {
    // message.error(error);
    notification.error({
      message: error,
      placement: 'bottomRight',
    });
  });
};

const AddMembersModal = ({ team }: Props) => {
  const [listEmails, setListEmails] = useState<string[]>([]);
  const formRef = useRef<FormInstance>(null);
  const { t } = useTranslation();
  const [link, setLink] = useState(`${config?.AUTH0_WEBAUTH_CONFIG?.redirectUri}/invite-link/${team?.id}`);

  useEffect(() => {
    setLink(`${config?.AUTH0_WEBAUTH_CONFIG?.redirectUri}/invite-link/${team?.id}`);
  }, [team]);

  const [addNewMember] = useMutation<MemberMutations.addMembersResult, MemberMutations.addMembersVars>(
    MemberMutations.addMembers,
    {
      refetchQueries: [TeamQueries.getTeams, TeamQueries.getTeam],
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
      onCompleted: (data) => {
        showNotification(data.addMembers);
        formRef.current?.resetFields();
      },
    },
  );

  const [changeTeamAccess, { loading }] = useMutation<
    TeamMutations.changeTeamAccessResult,
    TeamMutations.changeTeamAccessVars
  >(TeamMutations.changeTeamAccess, {
    refetchQueries: [TeamQueries.getTeams, TeamQueries.getTeam],
    onError: (error) => {
      notification?.error({
        message: error?.message,
        placement: 'bottomRight',
      });
    },
  });

  const onAddEmail = (value: any) => {
    if (validEmail.test(value.email)) {
      if (!listEmails.includes(value.email)) {
        const newListEmails = _.clone(listEmails);
        setListEmails([...newListEmails, value.email]);
      }
      formRef.current?.resetFields();
    } else {
      notification.warning({
        message: `Notification`,
        description: `${value.email} is not a valid email`,
        placement: 'bottomLeft',
      });
    }
  };

  const handleClose = (removedEmail: string) => {
    const newListEmails = listEmails.filter((email) => email !== removedEmail);
    setListEmails(newListEmails);
  };

  const tagChild = listEmails.map((email) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(email);
        }}
      >
        {email}
      </Tag>
    );
    return (
      <span key={email} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  });

  const handleCreate = async () => {
    if (listEmails.length <= 0) return;
    const myListEmails = _.clone(listEmails);
    setListEmails([]);
    addNewMember({ variables: { emailUsers: myListEmails, teamId: team?.id as string } });
  };

  const copyToClipboard = async () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.info('Embedded Url is copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy url to clipboard!');
      });
  };

  const handleChangeAccess = (value: boolean) => {
    if (team) {
      changeTeamAccess({ variables: { teamId: team?.id, isPublic: value } });
    }
  };


  return (
    <div>
      <h3>{t(`txt_member_add`)}</h3>
      <h4 className="flex flex-dir-r mt-25">
        {t(`txt_member_URL`)}
        <Switch
          loading={loading}
          disabled={loading}
          style={{ marginLeft: 'auto' }}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={handleChangeAccess}
          checked={team?.isPublic}
        />
      </h4>
      <p>{t(`txt_member_join_link`)}</p>
      <div>
        <Input.Group compact>
          <Input disabled={true} style={{ width: 'calc(100% - 80px)' }} defaultValue={`${link}`} />
          <Tooltip title="copy git url">
            <Button
              style={{ borderRadius: '0px' }}
              disabled={!team?.isPublic}
              onClick={copyToClipboard}
              icon={<CopyOutlined />}
            />
          </Tooltip>
        </Input.Group>
      </div>
      <p>{t(`txt_member_feature`)}</p>
      <h4 className="mt-25">{t(`txt_member_email`)}</h4>
      <Form onFinish={(value) => onAddEmail(value)} ref={formRef}>
        <Input.Group compact className="flex flex-dir-r">
          <Form.Item
            style={{ width: 'calc(100% - 30px)' }}
            name="email"
            rules={[
              { required: true, message: `${t(`txt_member_error_input`)}` },
              { type: 'email', message: `${t(`txt_member_error`)}` },
            ]}
          >
            <Input allowClear autoFocus placeholder={`${t(`txt_member_placeholder`)}`} />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              icon={<UserAddOutlined />}
              size="middle"
              style={{ width: '100px' }}
              title="Add"
              type="primary"
            >
              {t(`txt_member_add_button`)}
            </Button>
            <Button
              className="ml-10"
              icon={<SendOutlined />}
              size="middle"
              style={{ width: '100px' }}
              title="Send"
              disabled={!(listEmails && listEmails.length > 0)}
              type="primary"
              onClick={handleCreate}
            >
              {t(`txt_member_send`)}
            </Button>
          </Form.Item>
        </Input.Group>
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
            }}
            onEnd={(e: any) => {
              if (e?.type === 'appear' || e?.type === 'enter') {
                e.target.style = 'display: inline-block';
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
      </Form>
    </div>
  );
};

export default AddMembersModal;
