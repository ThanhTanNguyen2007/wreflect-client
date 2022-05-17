import { Avatar, Dropdown, Input, Menu, Modal, notification, Tooltip } from 'antd';
import React, { KeyboardEvent, useEffect, useState, useRef } from 'react';
import { Opinion, Remark, Column, Board, Member, Team } from '../../../types';
import { EllipsisOutlined, DeleteFilled, ArrowRightOutlined } from '@ant-design/icons';
import { useMutation, useApolloClient } from '@apollo/client';
import { RemarkMutations } from '../../../grapql-client/mutations';
import _ from 'lodash';
import moment from 'moment';

type Props = {
  iMember?: Member;
  isOpenRemark: boolean;
  setIsOpenRemark: (closeRemark: boolean) => void;
  team: Team;
  board: Board;
  column: Column;
  opinion: Opinion;
};

const { TextArea } = Input;

export default function RemarkComponent({
  team,
  iMember,
  isOpenRemark,
  setIsOpenRemark,
  board,
  column,
  opinion,
}: Props) {
  const [textRemark, setTextRemark] = useState('');
  const remarkListRef = useRef<HTMLDivElement>(null);
  const client = useApolloClient();

  useEffect(() => {
    remarkListRef?.current?.scrollTo(0, remarkListRef.current.scrollHeight);
  }, [opinion, isOpenRemark]);

  const [createRemark] = useMutation<RemarkMutations.createRemarkResult, RemarkMutations.createRemarkVars>(
    RemarkMutations.createRemark,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
    },
  );

  const [removeRemark] = useMutation<RemarkMutations.removeRemarkResult, RemarkMutations.removeRemarkVars>(
    RemarkMutations.removeRemark,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
    },
  );

  const handleOnCreateRemark = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // e.preventDefault();
    if (!e.shiftKey && e.currentTarget.value.trim() != '' && e.currentTarget.value !== '') {
      createRemark({
        variables: {
          teamId: board.teamId,
          boardId: board.id,
          columnId: column.id,
          opinionId: opinion.id,
          text: e.currentTarget.value,
        },
        update: () => {
          setTextRemark('');
        },
      });
    }
  };
  return (
    <Modal
      className={`headerModal-${opinion.color}`}
      title={
        <div className="flex flex-dir-c headerModalText">
          <div className="owner-opinion">
            <Avatar.Group
              maxCount={2}
              style={{
                cursor: 'pointer',
              }}
              maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            >
              {team.members
                ?.filter((member) => opinion.mergedAuthors.includes(member?.id) || opinion?.authorId == member?.id)
                .map((member) => (
                  <Tooltip title={member?.user?.nickname} key={member?.user?.email} placement="bottom">
                    <Avatar
                      style={{ marginRight: '3px' }}
                      size="default"
                      key={member?.user?.email}
                      src={member?.user?.picture}
                    />
                  </Tooltip>
                ))}
            </Avatar.Group>
          </div>
          <p>{opinion.text}</p>
        </div>
      }
      centered
      visible={isOpenRemark}
      closable
      footer={null}
      onCancel={() => setIsOpenRemark(false)}
    >
      <div className="remarkline" ref={remarkListRef}>
        {opinion.remarks?.map((remark) => (
          <div key={remark?.id} className="remark">
            <div className="remarkHeader">
              <p style={{ fontWeight: 'bold !important' }}>
                {board.isAnonymous ? 'Anonymous' : `${remark?.author?.user?.nickname}`}
              </p>
              {(iMember?.isOwner || iMember?.isSuperOwner || remark?.authorId === iMember?.id) && (
                <Dropdown
                  overlayStyle={{ width: '180px' }}
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => {
                          console.log(opinion);
                          const prevOpinion = _.cloneDeep(opinion);
                          client.cache.modify({
                            id: client.cache.identify(opinion),
                            fields: {
                              remarks(existingData, { readField }) {
                                return existingData.filter((cur: Remark) => readField('id', cur) !== remark.id);
                              },
                            },
                          });
                          removeRemark({
                            variables: {
                              teamId: board.teamId,
                              boardId: board.id,
                              columnId: column.id,
                              opinionId: opinion.id,
                              remarkId: remark.id,
                            },
                            onError() {
                              client.cache.modify({
                                id: client.cache.identify(opinion),
                                fields: {
                                  remarks() {
                                    return prevOpinion.remarks;
                                  },
                                },
                              });
                            },
                          });
                        }}
                        key="3"
                        icon={<DeleteFilled />}
                      >
                        Remove
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomRight"
                >
                  <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Dropdown>
              )}
            </div>
            <div className="flex flex-dir-r flex-ai-c remarkContent">
              <ArrowRightOutlined /> &nbsp;
              <div style={{ flex: 1 }}>{remark.text}</div>
              <div style={{ left: 'auto', fontSize: '10px' }}>
                {moment(new Date(+remark.createdAt)).format('DD/MM/YYYY hh:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>
      <TextArea
        autoFocus
        placeholder="Remark something here..."
        style={{ marginTop: '20px' }}
        value={textRemark}
        onChange={(value) => setTextRemark(value.currentTarget.value)}
        onPressEnter={handleOnCreateRemark}
      />
    </Modal>
  );
}
