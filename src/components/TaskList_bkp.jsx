import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Card, CardContent, CardHeader, Fab, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';

import callApis from '../services/CallAPI';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';



const defaultTheme = createTheme();

function TasksList() {
    const navigate = useNavigate();
    const columns = [
        { field: 'id', headerName: 'Sr. No.', width: 50 },
        { field: 'projectName', headerName: 'Project Name', width: 150 },
        { field: 'taskName', headerName: 'Task Name', width: 150 },
        { field: 'taskPriority', headerName: 'Priority', width: 100 },
        { field: 'taskDuration', headerName: 'Duration', width: 150 },
        { field: 'taskOwners', headerName: 'Task Owners', width: 250 },
        { field: 'task_status', headerName: 'Task Status', width: 80 },
        { field: 'created', headerName: 'Created', width: 90 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 60,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleEditClick(params)}
                >
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    const rows = [
        { id: 1, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 2, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 3, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 4, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 5, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 6, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 7, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 8, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 9, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 10, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
        { id: 11, projectName: 'Moverick Media Monitering', projectDesc: 'Moverick Media Monitering long project description provide by client', assignedBy: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", status: "Active" },
    ];
    const handleEditClick = (id) => {
        // Handle the edit action, e.g., open an edit dialog or navigate to an edit page
        console.log(id)
        console.log(`Edit button clicked for row with id: ${id}`);
    };
    return (
        <>
            {/* Content body start */}
            <div className="content-body">
                {/* <!-- row --> */}
                <div className="container-fluid mt-2 pt-1">
                    <div className='row'>
                        <div className='col-12'>
                            <Card>
                                <CardContent >
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <h3>All Tasks</h3>
                                        </div>
                                        <div className='col-6 float-right'>
                                            <Link to={"/user/create-project"}><Fab color="primary" style={{float:"right"}} size="small" aria-label="add">
                                                <AddIcon />
                                            </Fab></Link>
                                        </div>
                                    </div>
                                    <Container className='m-0 p-0' maxWidth="lg">
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 10 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                        // checkboxSelection
                                        />
                                    </Container>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </div>
            </div>
            {/* Content body end */}
        </>
    );
}
export default TasksList;