import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Button, notification, Card } from 'antd';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { OpinionStatus } from '../../../types';
import { useMutation, useQuery } from '@apollo/client';
import { TeamQueries } from '../../../grapql-client/queries';
import { columnActionTrackerDefault } from '../../../const/boardTemplateOption';
import { TopNavBar } from '../../../components/TopNavBar';
import { OpinionMutations, TeamMutations } from '../../../grapql-client/mutations';
import ActionSelect from './actionSelect';
import CreateAction from './createAction';
import selfContext from '../../../contexts/selfContext';
import { Loading } from '../../../components/Loading';
import { P } from '@antv/g2plot';

const { Option } = Select;

type Props = {
  teamId: string;
};

export default function ActionsTracker({ teamId }: Props) {
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedAssigners, setSelectedAssigners] = useState<string[]>([]);
  const me = useContext(selfContext);
  const { t } = useTranslation();

  const { data, refetch, error, loading } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: {
        teamId,
      },
    },
  );

  useEffect(() => {
    setSelectedBoards(data?.team?.boards?.map((board) => board.id) || []);
    setSelectedAssigners([...(data?.team?.members?.map((member) => member?.user?.id) || []), 'not-assigned'] || []);
  }, []);

  const [updateOpinion] = useMutation(OpinionMutations.updateOpinion, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message:
          error?.message === 'You dont have permission for this mutation' &&
          'You can only change actions that assigned to you',
      });
    },
  });

  const handleOnDragEnd = (result: DropResult) => {
    if (result && !result.destination) return;
    updateOpinion({
      variables: {
        teamId,
        opinionId: result.draggableId,
        status: result.destination?.droppableId as OpinionStatus,
      },
      optimisticResponse: {
        updateOpinion: {
          id: result.draggableId,
          __typename: 'Opinion',
          status: result.destination?.droppableId as OpinionStatus,
        },
      },
    });
  };

  const optionChildBoard = data?.team?.boards.map((board) => (
    <Option key={board.id} value={board.id}>
      {board.title}
    </Option>
  ));

  const optionChildAssignees = data?.team?.members.map((member) => (
    <Option key={member?.id} value={member?.user?.id}>
      {member?.user?.nickname}
    </Option>
  ));

  const handleOnSelectBoards = (value: string) => {
    if (value === 'selectAll') {
      setSelectedBoards(data?.team?.boards?.map((board) => board.id) || []);
    } else {
      setSelectedBoards([...selectedBoards, value]);
    }
  };

  const handleOnSelectAssigners = (value: string) => {
    if (value === 'selectAll') {
      setSelectedAssigners([...(data?.team?.members?.map((member) => member?.user?.id) || []), 'not-assigned'] || []);
    } else {
      setSelectedAssigners([...selectedAssigners, value]);
    }
  };

  const handleOnDeselectBoards = (value: string) => {
    setSelectedBoards(selectedBoards.filter((selectBoard) => selectBoard !== value));
  };
  const handleOnDeselectAssigners = (value: string) => {
    setSelectedAssigners(selectedAssigners.filter((selectAssigner) => selectAssigner !== value));
  };

  const iMember = data?.team?.members.find((member) => member.userId === me?.id);

  return (
    <>
      <TopNavBar iMember={iMember} team={data?.team} title="Actions Tracker" />
      <Loading data={data?.team} loading={loading} error={error}>
        <div className="actionsTracker flex flex-1 scrollable ">
          <Card className="fullBoard flex flex-1 p-10">
            <div className="header mb-10">
              <h2>{t(`txt_action_tracker`)}</h2>
              <p className="mt-10">
                {t(`txt_action_tracker_desc`)}
              </p>
            </div>
            <CreateAction team={data?.team} selectedBoards={selectedBoards} />
            <Card hoverable>
              <div className="flex flex-1 flex-dir-r flex-gap-24">
                <div className="flex flex-1 flex-dir-c">
                  <label>{t(`txt_action_tracker_board`)}</label>
                  <Select
                    onSelect={handleOnSelectBoards}
                    onDeselect={handleOnDeselectBoards}
                    showArrow
                    allowClear
                    onClear={() => setSelectedBoards([])}
                    placeholder="Select..."
                    mode="multiple"
                    style={{ width: '100%' }}
                    value={selectedBoards}
                  >
                    <Option key="selectAll" value="selectAll">
                      {t(`txt_assessment_create_select`)}
                    </Option>
                    {optionChildBoard}
                  </Select>
                </div>
                <div className="flex flex-1 flex-dir-c">
                  <label>{t(`txt_action_tracker_assignee`)}</label>
                  <Select
                    onSelect={handleOnSelectAssigners}
                    onDeselect={handleOnDeselectAssigners}
                    showArrow
                    allowClear
                    onClear={() => setSelectedAssigners([])}
                    placeholder="Select..."
                    mode="multiple"
                    value={selectedAssigners}
                    style={{ width: '100%' }}
                  >
                    <Option key="selectAll" value="selectAll">
                      {t(`txt_assessment_create_select`)}
                    </Option>
                    <Option key="notAssigned" value="not-assigned">
                      {t(`txt_action_tracker_not_assginee`)}
                    </Option>
                    {optionChildAssignees}
                  </Select>
                </div>
              </div>
            </Card>
            <div
              className="boardcont"
              style={{
                marginTop: '20px',
              }}
            >
              <div className="board flex flex-dir-r">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  {data?.team && data?.team?.boards.length != 0 ? (
                    columnActionTrackerDefault.map((columnActions: { name: string; key: string; index: string }) => {
                      return (
                        <Droppable key={columnActions.key} droppableId={columnActions.key}>
                          {(provided) => (
                            <div className="column flex" {...provided.droppableProps} ref={provided.innerRef}>
                              <div className="colHead">
                                <div className="titleHead">{columnActions.name}</div>
                                <div className="actionHead"></div>
                              </div>
                              <div className="colContent">
                                <div>
                                  {data?.team?.boards?.map((board) => {
                                    return (
                                      selectedBoards.includes(board.id) &&
                                      board?.columns?.map((column) =>
                                        column?.opinions?.map((opinion, index) => {
                                          if (
                                            opinion?.status === columnActions?.key &&
                                            selectedAssigners.includes(opinion.responsible)
                                          ) {
                                            return (
                                              <Draggable draggableId={opinion?.id} index={index} key={opinion?.id}>
                                                {(provided) => (
                                                  <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                  >
                                                    {opinion.isAction && (
                                                      <div className={`opinionCol ${opinion.color}`}>
                                                        <div className="opinionHeader"></div>
                                                        <div
                                                          style={{ flex: 1, flexDirection: 'column' }}
                                                          className="opinionContent"
                                                        >
                                                          <p>
                                                            {opinion?.text?.split('\n').map((str) => {
                                                              return (
                                                                <>
                                                                  {str}
                                                                  <br />
                                                                </>
                                                              );
                                                            })}
                                                          </p>
                                                          {/* <ActionComponent
                                                        board={board}
                                                        column={column}
                                                        opinion={opinion}
                                                      /> */}
                                                          <ActionSelect
                                                            team={data?.team}
                                                            board={board}
                                                            column={column}
                                                            opinion={opinion}
                                                          />
                                                        </div>
                                                        <div className="opinionFooter"></div>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </Draggable>
                                            );
                                          }
                                        }),
                                      )
                                    );
                                  })}
                                  {provided.placeholder}
                                </div>
                              </div>
                            </div>
                          )}
                        </Droppable>
                      );
                    })
                  ) : (
                    <div> no data</div>
                  )}
                </DragDropContext>
              </div>
            </div>
            <label className="error"></label>
          </Card>
        </div>
      </Loading>
    </>
  );
}
