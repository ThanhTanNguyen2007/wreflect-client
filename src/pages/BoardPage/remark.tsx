import { Dropdown, Input, Menu, Modal } from 'antd';
import React, { KeyboardEvent, useEffect, useState, useRef } from 'react';
import { Opinion, Remark, Column, Board, Member } from '../../types';
import { EllipsisOutlined, DeleteFilled, ArrowRightOutlined } from '@ant-design/icons';
import { useMutation, useApolloClient } from '@apollo/client';
import { RemarkMutations } from '../../grapql-client/mutations';
import _ from 'lodash';

type Props = {
  iMember?: Member;
  isOpenRemark: boolean;
  setIsOpenRemark: (closeRemark: boolean) => void;
  board: Board;
  column: Column;
  opinion: Opinion;
};

const { TextArea } = Input;

export default function RemarkComponent({ isOpenRemark, setIsOpenRemark, board, column, opinion }: Props) {
  const [textRemark, setTextRemark] = useState('');
  const remarkListRef = useRef<HTMLDivElement>(null);
  const client = useApolloClient();

  useEffect(() => {
    remarkListRef?.current?.scrollTo(0, remarkListRef.current.scrollHeight);
  }, [opinion, isOpenRemark]);

  const [createRemark] = useMutation<RemarkMutations.createRemarkResult, RemarkMutations.createRemarkVars>(
    RemarkMutations.createRemark,
  );

  const [removeRemark] = useMutation<RemarkMutations.removeRemarkResult, RemarkMutations.removeRemarkVars>(
    RemarkMutations.removeRemark,
  );

  const handleOnCreateRemark = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.currentTarget.value !== '') {
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
        <div className="headerModalText">
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
              <p style={{ fontWeight: 'bold !important' }}>{remark?.author.nickname}</p>
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
            </div>
            <div className="remarkContent">
              <ArrowRightOutlined /> &nbsp;{remark.text}
            </div>
          </div>
        ))}
      </div>
      <TextArea
        autoFocus
        style={{ marginTop: '20px' }}
        value={textRemark}
        onChange={(value) => setTextRemark(value.currentTarget.value)}
        onPressEnter={handleOnCreateRemark}
      />
    </Modal>
  );
}
