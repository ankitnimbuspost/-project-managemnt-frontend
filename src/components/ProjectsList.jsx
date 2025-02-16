import * as React from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card, CardContent, Fab, FormControl, IconButton, InputLabel, Menu, MenuItem, Select } from '@mui/material';
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from "@mui/icons-material/MoreVert";

import callApis from '../services/CallAPI';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { authenticateUser } from '../services/CommonFunction';
const micro_socket = require("../config/micro-socket");



const defaultTheme = createTheme();

function CreateProject() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    React.useEffect(() => {
        if (!authenticateUser()) {
            window.location.href = '/signin';
            return;
        }

        const loadProjects = async () => {
            try {
                let resp = await callApis.callTaskMicroPostApi("get-all-projects", {}, "GET");
                console.log("API Response:", resp);

                if (resp.code === 200) {
                    setProjects(resp.data);
                } else {
                    alert("Something went wrong!!");
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                alert("Failed to load projects.");
            }
        };
        loadProjects();
    }, []);

    const columns = [
        { field: 'id', headerName: 'Sr. No', width: 50 },
        { field: 'project_name', headerName: 'Project Name', width: 150 },
        // {
        //     field: 'project_desc',
        //     headerName: 'Project Descriptio',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 300,renderCell: (params) => (
        //         <div dangerouslySetInnerHTML={{ __html: params.value }} />
        //     ),
        // },
        {
            field: 'status', headerName: 'Status', width: 80, renderCell: (params) => (
                <span style={{ color: params.value === 1 ? "green" : "red", fontWeight: "bold" }}>
                    {params.value === 1 ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            field: 'project_owners',
            headerName: 'Assigned to',
            width: 350,
            renderCell: (params) => {
                if (!params.value || !Array.isArray(params.value) || params.value.length == 0) return "N/A";

                return (
                    <span>
                        {params.value.map(owner => `${owner.f_name} ${owner.l_name}`).join(", ")}
                    </span>
                );
            }
        },
        { field: 'created', headerName: 'Created', width: 120 },
        { field: 'updated', headerName: 'Last Modified', width: 120 },
        {
            field: 'edit',
            headerName: 'Action',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={(event) => handleMenuClick(event, params.row)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedRow === params.row._id}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleEditClick}><EditIcon></EditIcon> Edit Project</MenuItem>
                        <MenuItem onClick={handleDeleteClick}><AddIcon></AddIcon> Assign Project</MenuItem>
                    </Menu>
                </div>
            )
        },
    ];
    // const handleEditClick = (id) => {
    //     // Handle the edit action, e.g., open an edit dialog or navigate to an edit page
    //     console.log(id)
    //     console.log(`Edit button clicked for row with id: `, id);
    // };
    const handleMenuClick = (event, rowId) => {
        setAnchorEl(event.currentTarget);
        console.log(rowId._id)
        setSelectedRow(rowId._id);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleEditClick = () => {
        console.log("Edit clicked for row:", selectedRow);
        handleClose();
    };

    const handleDeleteClick = () => {
        console.log("Delete clicked for row:", selectedRow);
        handleClose();
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
                                            <h3>All Projects</h3>
                                        </div>
                                        <div className='col-6 float-right'>
                                            <Link to={"/user/create-project"}><Fab color="primary" style={{ float: "right", zIndex: "auto" }} size="small" aria-label="add">
                                                <AddIcon />
                                            </Fab></Link>
                                        </div>
                                    </div>
                                    <Container className='m-0 p-0' maxWidth="lg">
                                        <DataGrid
                                            rows={projects}
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
export default CreateProject;