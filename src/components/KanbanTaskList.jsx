import "../css/custom.css"
import { Avatar, Card, CardContent, Paper, Stack } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { authenticateUser } from "../services/CommonFunction";
import callApis from '../services/CallAPI';
import { useSearchParams } from "react-router-dom";

const ItemType = 'CARD';

const TaskItem = ({ id, text }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { id, text },
  });

  return (
    <>
      <Card className='mt-1 mb-2 pb-0' ref={ref}>
        <CardContent className='pb-2 pt-2'>
          <div className="d-flex justify-content-between mb-2">
            <span className="sub-title">
              <svg
                className="me-2"
                width={10}
                height={10}
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx={5} cy={5} r={5} fill="#FFA7D7" />
              </svg>
              ISSUE TYPE
            </span>
            <div className="dropdown">
              <div className="btn-link" data-bs-toggle="dropdown">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="3.5"
                    cy="11.5"
                    r="2.5"
                    transform="rotate(-90 3.5 11.5)"
                    fill="#717579"
                  />
                  <circle
                    cx="11.5"
                    cy="11.5"
                    r="2.5"
                    transform="rotate(-90 11.5 11.5)"
                    fill="#717579"
                  />
                  <circle
                    cx="19.5"
                    cy="11.5"
                    r="2.5"
                    transform="rotate(-90 19.5 11.5)"
                    fill="#717579"
                  />
                </svg>
              </div>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="javascript:void(0)">
                  Delete
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  Edit
                </a>
              </div>
            </div>
          </div>
          <p className="font-w500 fs-14">
            <a href="javascript:void(0);" className="text-black">
            {text} Create wireframe for landing page phase 1
            </a>
          </p>
          <div className="row justify-content-between align-items-center kanban-user">
            <div className='col-7'>
              <Stack direction="row" spacing={-1} style={{ display: "inline-flex" }}>
                <Avatar className='task-owners' sx={{bgcolor: deepPurple[500] }} >OP</Avatar>
                <Avatar className='task-owners'sx={{ bgcolor: deepOrange[500] }} >NA</Avatar>
                <Avatar className='task-owners' sx={{bgcolor: deepPurple[500] }} >OP</Avatar>
              </Stack>
            </div>
            <div className="col-5 m-0 p-0">
              <span style={{fontSize:"0.7rem"}}>
                <i className="far fa-clock me-2" />
                Due in 4 days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>


    </>
  );
};



// --------------------------------*********************************-------------------------

const TaskColumn = ({ title, cards, moveCard, columnId }) => {
  const [, ref] = useDrop({
    accept: ItemType,
    drop: (item) => {
      console.log('Drop ', item)
      moveCard(item.id, columnId);
    },
  });

  return (
    <>
      <div ref={ref} className="col">
        <div className='kanbanPreview-bx'>
          <div className='draggable-zone dropzoneContainer'>
            <div className="sub-card align-items-center d-flex justify-content-between mb-4" ref={ref}>
              <div>
                <h4 className="fs-18 mb-0 font-w600">{title} (
                  <span className="totalCount">{Object.keys(cards).length}</span>)
                </h4>
              </div>
              <div className="plus-bx">
                <a href="javascript:void(0)">
                  <i className="fas fa-plus"></i>
                </a>
              </div>
            </div>
            {/* Show Task Item One By One  */}
            {cards.map((card) => (
              <>
                <TaskItem key={card.id} id={card.id} text={card.text} />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};


// ------------------------**************************------------------------------


const KanbanTaskList = (props) => {
  const [columns, setColumns] = React.useState({});
  const [taskStatus,setTaskStatus] = React.useState(true);
  
  console.log(props)
  React.useEffect(()=>{
    if(!authenticateUser())
      window.location.href = '/signin';
    // Get All Tasks 
    const loadTasks = async () =>{
      // let request={
        // "owners":["661687e9a42e6224fcfd86f9"],
        // "tags":["11111","123"],
        // "id":"66b2238accd713eb09644a06",
        // "task_id":"00012",
        // "project_id":"66406bf5606ddee8007c9484",
        // "added_by":"661253f489a31fa6c29b6c11",
        // "task_status":"open",
        // "task_name":"task"
        // "priority":"High",
      //   "list_type":"kanban"
      // }
      let resp = await callApis.callTaskMicroPostApi("get-task-list", props.filter);
      if(resp.code==200){
        setColumns(resp.data)
      }
    }
    loadTasks();
    
  },[props]);

  const [count, setCount] = React.useState(1);
  // This Function Find Cards by ID  and delete
  function findDeleteCardById(obj, id) {
    for (let column in obj) {
      console.log(obj[column].tasks)
      const tasks = obj[column].tasks;
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
          const card = tasks.splice(i, 1)[0]; // Remove and return the card
          return card;
        }
      }
    }
    return null; // Return null if the card is not found
  }
  const moveCard = (draggedId, targetColumn) => {
    console.log("Move Card running")
    const card = findDeleteCardById(columns, draggedId);
    columns[`${targetColumn}`].tasks.push(card);
    setCount(count + 1);
  };
  return (
    <div className='row kanban-bx m-0 p-0'>
      {Object.keys(columns).map((columnId) => (
        <TaskColumn
          key={columnId}
          columnId={columnId}
          title={columns[columnId].title}
          cards={columns[columnId].tasks}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
};
export default KanbanTaskList;
