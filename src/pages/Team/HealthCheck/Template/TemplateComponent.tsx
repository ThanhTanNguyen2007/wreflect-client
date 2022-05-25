import React, { useState } from 'react';
import { Button, Card, Form, Input, Modal, notification } from 'antd';
import { useTranslation } from 'react-i18next';

import { Member, Template } from '../../../../types';
import BadgeComponent from '../../../../components/Badge/BadgeComponent';
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DeleteCustomTemplate from './DeleteCustomTemplate';
import UpdateCustomTemplate from './UpdateCustomTemplate';

type Props = {
  iMember: Member;
  template: Template;
  setSelectedTemplate: (value: Template) => void;
};

export default function TemplateComponent({ iMember, setSelectedTemplate, template }: Props) {
  const { t, i18n } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <UpdateCustomTemplate template={template} isVisible={isUpdating} setIsVisible={setIsUpdating} />
      <DeleteCustomTemplate template={template} isVisible={isDeleting} setIsVisible={setIsDeleting} />
      <Card
        bodyStyle={{ display: 'flex', flex: '1', flexDirection: 'column' }}
        hoverable
        key={template?.id}
        className=" templates-overview-card"
      >
        <BadgeComponent isVisible={template?.isDefault} title={t(`txt_default`)}>
          <div className="flex flex-1 flex-dir-c flex-gap-24 poll-center-items">
            <h3>{t(template?.title)}</h3>
            <div className="statement-wrapper poll-center-items">
              {template?.healthCheckQuestions?.map((questions) => (
                <span className={`statement ${questions.color}`} key={questions?.id}>
                  {questions?.title}
                </span>
              ))}
            </div>
            <div className="flex flex-dir-r flex-gap-5">
              <Button
                onClick={() => {
                  if (iMember?.isOwner || iMember?.isSuperOwner) {
                    setSelectedTemplate(template);
                  } else {
                    notification.warning({
                      message: 'Permission denied',
                      description: 'Only Super Owner and Owners can access HeathCheck templates.',
                      placement: 'bottomRight',
                    });
                  }
                }}
                type="primary"
              >
                Show Details
              </Button>
              {!template?.isDefault && (iMember?.isSuperOwner || iMember?.isOwner) && (
                <>
                  <Button icon={<EditOutlined onClick={() => setIsUpdating(true)} />}></Button>
                  <Button icon={<DeleteOutlined onClick={() => setIsDeleting(true)} />}></Button>
                </>
              )}
            </div>
          </div>
        </BadgeComponent>
      </Card>
    </>
  );
}
