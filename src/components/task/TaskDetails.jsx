import { Box, Card, CardContent, CardHeader, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { lazy, useEffect, useRef, useState } from "react";
import "../../css/task-style.css";
import { authenticateUser, formatFiles } from "../../services/CommonFunction";
import micro_socket from "../../config/micro-socket";
const TaskComment = lazy(() => import("./TaskComment"));
const SubTask = lazy(() => import('./SubTask'));
const LogHours = lazy(() => import("./LogHours"));
const StatusTimeline = lazy(()=>import("./StatusTimeline"))
const Documents = lazy(()=>import("./Documents"));


function TaskDetails(props) {
    const [taskStatus, setTaskStatus] = useState('1');
    const [currentTab, setCurrentTab] = useState('comments');
    const [task,setTask] = useState(null);
    let taskId = "66cefd16c838ac8b19f2e0d7";
    
    useEffect(() => {
        console.log("Use effect 2 call")
        if (!taskId) return;
        // 🟢 Join the task room
        micro_socket.emit("join_task", { task_id: taskId });

        // 🟡 Listen for Initial Task Data
        micro_socket.on("task_details", (response) => {
            setTask(response.data);
            console.log(response.data)
        });
        // Handle errors
        micro_socket.on("error", (error) => {
            console.error(error.message);
        });

        // 🔄 Listen for Real-time Task Updates
        micro_socket.on("task_updated", (response) => {
            if (response.data.id === taskId) {
                setTask(response.data);
            }
        });

        // 🔴 Cleanup: Leave Room When Component Unmounts
        return () => {
            micro_socket.emit("leave_task", { task_id: taskId });
            micro_socket.off("task_details");
            micro_socket.off("task_updated");
        };
    }, []);

    return <>
        {/* Content body start */}
        <div className="content-body">
            {/* <!-- row --> */}
            <div className="container-fluid mt-2 pt-1">
                <div className='row'>
                    <div className='col-12'>
                        <Card>
                            <CardHeader title="Import options columns needs to be update." />
                            <CardContent className="m-0 p-0">
                                <Container className="m-0 p-0" maxWidth="lg">
                                    <p>{JSON.stringify(task)}</p>
                                    <div className="activity d-flex align-items-center mt-0 pt-0">
                                        <ul className="d-flex">
                                            <li><a href="javascript:void(0);" className="header-info">By Ankit Thakur</a></li>
                                            <li><a href="javascript:void(0);" className="header-info"><i className="fas fa-video"></i> Company Name</a></li>
                                            <li><a href="javascript:void(0);" className="header-info"><i className="fas fa-search"></i> (5)</a></li>
                                            <li><a href="javascript:void(0);" className="header-info"><i className="fas fa-star text-orange"></i></a></li>
                                        </ul>
                                    </div>
                                    <Box ml={0} mt={2} mb={2} className="row pl-2 ml-2">
                                        {/* <Box component="row" fullWidth noValidate > */}
                                        <Grid role="column" className="col-lg-4 col-md-8 col-12">
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Current Task Status</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={taskStatus}
                                                    label="Current Task Status"

                                                >
                                                    <MenuItem value={1}>Active</MenuItem>
                                                    <MenuItem value={0}>InActive</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {/* </Box> */}
                                    </Box>
                                    <Box ml={0} mt={2} mb={2} className="row pl-0 ml-0">
                                        <div className="custom-tab-1">
                                            <ul className="nav nav-tabs">
                                                <li className="nav-item" onClick={() => setCurrentTab("comments")}><a href="#my-posts" data-bs-toggle="tab" className="nav-link active show">Comments(5)</a>
                                                </li>
                                                <li className="nav-item" onClick={() => setCurrentTab("subtask")}><a href="#about-me" data-bs-toggle="tab" className="nav-link">Sub Task</a>
                                                </li>
                                                <li className="nav-item" onClick={() => setCurrentTab("loghours")}><a href="#profile-settings" data-bs-toggle="tab" className="nav-link">Log Hours</a>
                                                </li>
                                                <li className="nav-item" onClick={() => setCurrentTab("documents")}><a href="#profile-settings" data-bs-toggle="tab" className="nav-link">Documents</a>
                                                </li>
                                                <li className="nav-item" onClick={() => setCurrentTab("statustimeline")}><a href="#profile-settings" data-bs-toggle="tab" className="nav-link">Status Timeline</a>
                                                </li>
                                            </ul>
                                            <div className="tab-content">
                                                {currentTab == 'comments' ? <>
                                                    <TaskComment></TaskComment>
                                                </> : currentTab == 'subtask' ? <>
                                                    <SubTask></SubTask>
                                                </> : currentTab == 'loghours' ? <>
                                                    <LogHours></LogHours>
                                                </> : currentTab=='documents' ? <>
                                                    <Documents></Documents>
                                                </> : currentTab=='statustimeline' ? <>
                                                    <StatusTimeline></StatusTimeline>
                                                </> : ''
                                                }
                                            </div>
                                        </div>
                                    </Box>
                                </Container>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
        {/* Content body end */}
    </>;
}

export default TaskDetails;