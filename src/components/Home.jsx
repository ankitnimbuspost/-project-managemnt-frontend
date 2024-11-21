import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import '../css/custom.css'
import Breadcrumbs from "./common/MyBreadcrumbs";
import KanbanTaskList from "./KanbanTaskList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import callApis from "../services/CallAPI";
import { authenticateUser } from "../services/CommonFunction";

export default function Home() {
    let navigate = useNavigate();
    // FIlter Fileds 
    const [searchParams,setSearchParams] = useSearchParams();
    const [ownerState, setOwnerState] = useState(null);
    const [priorityState, setPriorityState] = useState(null);
    const [dialogStatus,setDialogStatus] = useState(false);
    const [taskFilter,setTaskFilter] = useState({
        "list_type":"kanban"
    });

    React.useEffect(()=>{
        if(!authenticateUser())
          window.location.href = '/signin';
        function getFilterData(){
            const params = Object.fromEntries([...searchParams]);
            if(Object.keys(params).length>0)
                setTaskFilter(params);
            else
                setTaskFilter({"list_type":"kanban"})
        }
        getFilterData()
    },[searchParams]);

    let sendInvitation = async (event)=>
    {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const email = formJson.email;
        let resp = await callApis.callUserMicroPostApi("share-invitation",{email:email})
        if (resp.code === 200) {
            handleInviteDialogClose();
        }
        else
            alert(resp.message);
    }
    function filterSubmit(event) {
        event.preventDefault();
        let filter={
            "list_type":"kanban",
            "id":"66b2238accd713eb09644a06",
        }
        setTaskFilter(filter)
        alert("Filter Submit");
        setSearchParams(filter)
    }
    function handleInviteDialogClose()
    {
        setDialogStatus(false)
    }
    function handleInviteDialogOpen()
    {
        setDialogStatus(true)
    }
    return <>
        {/* Content body start */}
        <div className="content-body">
            {/* <!-- row --> */}
            <div className="container-fluid mt-1 pt-1">
                <div className="row ">
                    <div className="col-xl-12">
                        <div className="row">
                            <div className="col-xl-12">
                                <Breadcrumbs menu="Dashboard" submenu="Kanban"></Breadcrumbs>
                                <Card>
                                    {/* <CardHeader title="Update Profile" /> */}
                                    <CardContent className="mb-0 pb-0">
                                        <div className="workload-button">
                                            <Button onClick={() => navigate('/user/create-task')} variant="contained" size="small" className="btn-rounded add-task-button">
                                                <i className="fas fa-plus" size="small"></i>&nbsp;&nbsp;Create Task
                                            </Button>
                                            <Button onClick={()=>handleInviteDialogOpen()} className="light btn-rounded">
                                                <i className="fas fa-user-plus scale5 me-3"></i>Invite People
                                            </Button>
                                            <Stack direction="row" spacing={-1} style={{ display: "inline-flex" }}>
                                                <Avatar sx={{ width: 35, height: 35, bgcolor: deepOrange[500] }} style={{ border: "2px solid white", fontSize: "1rem" }}>NA</Avatar>
                                                <Avatar sx={{ width: 35, height: 35, bgcolor: deepPurple[500] }} style={{ border: "2px solid white", fontSize: "1rem" }}>OP</Avatar>
                                                <Avatar sx={{ width: 35, height: 35, bgcolor: deepOrange[500] }} style={{ border: "2px solid white", fontSize: "1rem" }}>NA</Avatar>
                                                <Avatar sx={{ width: 35, height: 35, bgcolor: deepPurple[500] }} style={{ border: "2px solid white", fontSize: "1rem" }}>OP</Avatar>
                                                <Avatar sx={{ width: 35, height: 35, bgcolor: deepOrange[500] }} style={{ border: "2px solid white", fontSize: "1rem" }}>NA</Avatar>
                                                <Avatar sx={{ width: 35, height: 35, bgcolor: deepPurple[500] }} style={{ border: "2px solid white", fontSize: "1rem" }}>OP</Avatar>
                                            </Stack>
                                        </div>
                                        {/* Filter Start  */}
                                        <Accordion className="m-0 p-0" elevation={0} sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                                            <AccordionSummary
                                                expandIcon={<ArrowDownwardIcon />}
                                                aria-controls="panel1-content"
                                                id="panel1-header"
                                            >
                                                <Typography>Apply Filter</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box component="form" className="m-0 p-0" noValidate onSubmit={filterSubmit} sx={{ flexGrow: 1 }}>
                                                    <Grid container spacing={2} >
                                                        <Grid item xs={12} sm={6} md={4} lg={3} className="mt-0 pt-0">
                                                            <TextField
                                                                margin="normal"
                                                                label="Task ID"
                                                                autoComplete="Task ID"
                                                                size="small"
                                                                fullWidth
                                                                autoFocus
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3} className="mt-0 pt-0">
                                                            <TextField
                                                                margin="normal"
                                                                label="Task Name"
                                                                autoComplete="Task Name"
                                                                size="small"
                                                                fullWidth
                                                                autoFocus
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                                            <FormControl fullWidth className="m-0 p-0" size="small">
                                                                <InputLabel id="owner-select-label">Project Owner</InputLabel>
                                                                <Select
                                                                    labelId="owner-select-label"
                                                                    value={ownerState}
                                                                    label="Project Owner"
                                                                    onChange={(event) => setOwnerState(event.target.value)}
                                                                >
                                                                    <MenuItem value={10}>Ankit</MenuItem>
                                                                    <MenuItem value={20}>Amit</MenuItem>
                                                                    <MenuItem value={30}>Vinit</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                                            <FormControl fullWidth className="m-0 p-0" size="small">
                                                                <InputLabel id="priority-select-label">Priority</InputLabel>
                                                                <Select
                                                                    labelId="priority-select-label"
                                                                    value={priorityState}
                                                                    label="Priority"
                                                                    onChange={(event) => setPriorityState(event.target.value)}
                                                                >
                                                                    <MenuItem value={10}>High</MenuItem>
                                                                    <MenuItem value={20}>Medium</MenuItem>
                                                                    <MenuItem value={30}>Low</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={3} lg={1}>
                                                            <Button
                                                                type="submit"
                                                                fullWidth
                                                                variant="contained"
                                                                size="small"
                                                                color="success"
                                                                className=" mt-0 btn-rounded"
                                                            >
                                                                Apply
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={6} sm={6} md={3} lg={1}>
                                                            <Button
                                                                type="submit"
                                                                fullWidth
                                                                variant="contained"
                                                                size="small"
                                                                color="warning"
                                                                className="btn-rounded mt-0"
                                                            >
                                                                Reset
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                        {/* Filter End  */}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <Card sx={{ mt: 1 }} lg={{ mt: 1 }} style={{ backgroundColor: "revert" }}>
                            <CardContent className="m-0 p-0 pt-2">
                                <DndProvider backend={HTML5Backend}>
                                    <KanbanTaskList filter={taskFilter}></KanbanTaskList>
                                </DndProvider>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        {/* Content body end */}
        {/* Invite People Dialog  */}
        <Dialog
        open={dialogStatus}
        onClose={handleInviteDialogClose}
        PaperProps={{
          component: 'form',
          onSubmit:(e)=>{sendInvitation(e)}
        }}
      >
        <DialogTitle>Invite People</DialogTitle>
        <DialogContent>
          <DialogContentText >
            To invite people to join with us and contribute tasks to work.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInviteDialogClose} color="error">Cancel</Button>
          <Button type="submit" variant="contained" color="success">Invite</Button>
        </DialogActions>
      </Dialog>
    </>;
}