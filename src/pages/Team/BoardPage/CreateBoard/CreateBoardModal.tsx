import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Input, Select, InputNumber, Switch, FormInstance, notification } from 'antd';

import { Board } from '../../../../types';
import boardTemplate from '../../../../const/boardTemplateOption';
import ConfigColumn from './configColumn';
import { useMutation } from '@apollo/client';
import { BoardMutations } from '../../../../grapql-client/mutations';

type Props = {
  teamId: string;
  board?: Board;
  visible: boolean;
  setVisible: (isVisible: boolean) => void;
};

type boardTemplateType = {
  name: string;
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
};

const { Option } = Select;

export default function ConfigBoardModal({ teamId, board, visible, setVisible }: Props) {
  const [templateSelect, setTemplateSelect] = useState<string>('defaultBoard');
  const [currentTemplate, setBoardTemplate] = useState<boardTemplateType>();
  // boardTemplate.map((template, index) => boardOption.set(index, template));
  const form = useRef<FormInstance>(null);

  const handleSelectTemplate = (value: string) => {
    setTemplateSelect(`${value}`);
  };

  const [createBoard, { loading: creatingBoard }] = useMutation<
    BoardMutations.createBoardResult,
    BoardMutations.createBoardVars
  >(BoardMutations.createBoard, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
  });

  const [updateBoard, { loading: updatingBoard }] = useMutation<
    BoardMutations.updateBoardResult,
    BoardMutations.updateBoardVars
  >(BoardMutations.updateBoard, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
  });

  useEffect(() => {
    setBoardTemplate(boardTemplate.find((template) => template.name === templateSelect));
  }, [templateSelect]);

  const handleSubmitBoard = (values: any) => {
    if (
      (!values['Column1'] || !values['isActiveColumn1']) &&
      (!values['Column2'] || !values['isActiveColumn2']) &&
      (!values['Column3'] || !values['isActiveColumn3']) &&
      (!values['Column4'] || !values['isActiveColumn4']) &&
      (!values['Column5'] || !values['isActiveColumn5'])
    ) {
      notification.error({ message: 'Please choose at least 1 column to active.', placement: 'bottomRight' });
      return;
    }
    if (board) {
      updateBoard({
        variables: {
          teamId: teamId,
          boardId: board.id,
          isPublic: values['isPublic'],
          isAnonymous: values['isAnonymous'],
          disableDownVote: values['disableDownVote'],
          disableUpVote: values['disableUpVote'],
          votesLimit: values['votesLimit'],
          type: values['type'],
          title: values['title'],
          column1: values['Column1'],
          column2: values['Column2'],
          column3: values['Column3'],
          column4: values['Column4'],
          column5: values['Column5'],
          isActiveCol1: values['isActiveColumn1'],
          isActiveCol2: values['isActiveColumn2'],
          isActiveCol3: values['isActiveColumn3'],
          isActiveCol4: values['isActiveColumn4'],
          isActiveCol5: values['isActiveColumn5'],
        },
        onCompleted: () => {
          setVisible(false);
          setTemplateSelect('defaultBoard');
        },
      });
    } else {
      createBoard({
        variables: {
          teamId: teamId,
          isPublic: values['isPublic'],
          isAnonymous: values['isAnonymous'],
          disableDownVote: values['disableDownVote'],
          disableUpVote: values['disableUpVote'],
          votesLimit: values['votesLimit'],
          type: values['type'],
          title: values['title'],
          column1: values['Column1'],
          column2: values['Column2'],
          column3: values['Column3'],
          column4: values['Column4'],
          column5: values['Column5'],
          isActiveCol1: values['isActiveColumn1'],
          isActiveCol2: values['isActiveColumn2'],
          isActiveCol3: values['isActiveColumn3'],
          isActiveCol4: values['isActiveColumn4'],
          isActiveCol5: values['isActiveColumn5'],
        },
        onCompleted: () => {
          setVisible(false);
          setTemplateSelect('defaultBoard');
        },
      });
    }
  };

  return (
    <Modal
      className="configBoard"
      centered
      visible={visible}
      footer={null}
      destroyOnClose
      onCancel={() => {
        setVisible(false);
        setTemplateSelect('defaultBoard');
        form.current?.resetFields();
      }}
      width={1000}
    >
      <Form onFinish={handleSubmitBoard} ref={form}>
        <div className="config-board-modal">
          <div className="edit-board-modal">
            <h2>{board ? 'Edit board' : 'Create board'}</h2>
            <h4>Board Title</h4>
            <div>You can run a retrospective with phases</div>
            <Form.Item
              rules={[{ required: true, message: 'Please input your board title' }]}
              name="title"
              initialValue={board?.title}
            >
              <Input defaultValue={board?.title} placeholder="Board Title" />
            </Form.Item>

            <h4>Board Type</h4>
            <div>You can run a retrospective with phases</div>
            <Form.Item name="type" initialValue={board?.type ?? 'PHASE'}>
              <Select disabled defaultValue={board?.type ?? 'PHASE'}>
                <Option value="PHASE">Phase (Reflect, Group, Votes, Discuss)</Option>
                <Option value="DEFAULT">No Phase</Option>
              </Select>
            </Form.Item>
            <h4>Max Votes</h4>
            <div>{'The number of votes per participant '}</div>
            <Form.Item
              rules={[{ required: true, message: 'Please input limit votes' }]}
              name="votesLimit"
              initialValue={board?.votesLimit ?? 25}
            >
              <InputNumber min={1} max={25} style={{ width: '100%' }} value={board?.votesLimit ?? 25} />
            </Form.Item>
          </div>
          <div className="setting-board-modal">
            <h2>Configurations</h2>
            <div>
              <h4>Public Board</h4>
              <div>Anyone with the link to board can access it</div>
              <Form.Item name="isPublic" initialValue={board?.isPublic ?? false}>
                <Switch defaultChecked={board?.isPublic} />
              </Form.Item>
            </div>

            <div>
              <h4>Run Retrospective Anonymously</h4>
              <div>All the participants will give feedback anonymously</div>
              <Form.Item name="isAnonymous" initialValue={board?.isAnonymous ?? false}>
                <Switch defaultChecked={board?.isAnonymous} />
              </Form.Item>
            </div>
            {/* <div>
              <h4>Disable Up Votes</h4>
              <div>The participants will not be able to up vote</div>
              <Form.Item name="disableUpVote" initialValue={board?.disableUpVote ?? false}>
                <Switch defaultChecked={board?.disableUpVote} />
              </Form.Item>
            </div>
            <div>
              <h4>Disable Down Votes</h4>
              <div>The participants will not be able to down vote</div>
              <Form.Item name="disableDownVote" initialValue={board?.disableDownVote ?? false}>
                <Switch defaultChecked={board?.disableDownVote} />
              </Form.Item>
            </div> */}
          </div>
          <div className="config-column-board-modal">
            <h2>Columns</h2>
            <div style={{ marginTop: '10px', width: '100%' }}>
              <Select
                onSelect={handleSelectTemplate}
                style={{ marginBottom: '10px', width: '100%' }}
                defaultValue="defaultBoard"
              >
                <Option key="defaultBoard" value="defaultBoard">
                  -- Board Templates --
                </Option>
                {[
                  ...boardTemplate.map((template, index) => (
                    <Option key={`${index}`} value={template.name}>
                      {template.name}
                    </Option>
                  )),
                ]}
              </Select>

              {templateSelect === 'defaultBoard' ? (
                <>
                  {board?.columns && board?.columns.length > 0 ? (
                    <div className="listColumn">
                      <ConfigColumn
                        form={form}
                        placeholder="Column1"
                        key={board?.columns[0]?.id}
                        board={board}
                        column={board?.columns[0]}
                        titleColumn={board?.columns[0]?.title}
                      />
                      <ConfigColumn
                        form={form}
                        placeholder="Column2"
                        key={board?.columns[1]?.id}
                        board={board}
                        column={board?.columns[1]}
                        titleColumn={board?.columns[1]?.title}
                      />
                      <ConfigColumn
                        form={form}
                        placeholder="Column3"
                        key={board?.columns[2]?.id}
                        board={board}
                        column={board?.columns[2]}
                        titleColumn={board?.columns[2]?.title}
                      />
                      <ConfigColumn
                        form={form}
                        placeholder="Column4"
                        key={board?.columns[3]?.id}
                        board={board}
                        column={board?.columns[3]}
                        titleColumn={board?.columns[3]?.title}
                      />
                      <ConfigColumn
                        form={form}
                        placeholder="Column5"
                        key={board?.columns[4]?.id}
                        board={board}
                        column={board?.columns[4]}
                        titleColumn={board?.columns[4]?.title}
                      />
                    </div>
                  ) : (
                    <div className="listColumn">
                      <ConfigColumn form={form} placeholder="Column1" />
                      <ConfigColumn form={form} placeholder="Column2" />
                      <ConfigColumn form={form} placeholder="Column3" />
                      <ConfigColumn form={form} placeholder="Column4" />
                      <ConfigColumn form={form} placeholder="Column5" />
                    </div>
                  )}
                </>
              ) : (
                <div className="listColumn">
                  <ConfigColumn form={form} placeholder="Column1" titleColumn={currentTemplate?.column1} />
                  <ConfigColumn form={form} placeholder="Column2" titleColumn={currentTemplate?.column2} />
                  <ConfigColumn form={form} placeholder="Column3" titleColumn={currentTemplate?.column3} />
                  <ConfigColumn form={form} placeholder="Column4" titleColumn={currentTemplate?.column4} />
                  <ConfigColumn form={form} placeholder="Column5" titleColumn={currentTemplate?.column5} />
                </div>
              )}

              <div className="buttonGenerate">
                {/* <Button htmlType="submit" size="large" loading={loading}>
                  {board ? 'Update Board' : 'Create Board'}
                </Button> */}
                <Button loading={creatingBoard || updatingBoard} htmlType="submit" size="large">
                  {board ? 'Update Board' : 'Create Board'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
