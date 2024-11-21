import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Card, CardContent, CardHeader, Fab, FormControl, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import callApis from '../services/CallAPI';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import '../css/custom.css'
import { authenticateUser } from '../services/CommonFunction';


const defaultTheme = createTheme();

function TasksList() {
    const navigate = useNavigate();
    React.useEffect(()=>{
        if(!authenticateUser())
          window.location.href = '/signin';
    });
    const columns = [
        // { field: 'id', headerName: 'Sr. No.', width: 50 },
        { field: 'projectName', headerName: 'Project Name', width: 150 },
        { field: 'taskName', headerName: 'Task Name', width: 250 },
        { field: 'taskPriority', headerName: 'Priority', width: 100 },
        { field: 'taskDuration', headerName: 'Duration', width: 150 },
        { field: 'taskOwners', headerName: 'Task Owners', width: 250 },
        { field: 'task_status', headerName: 'Task Status', width: 130 },
        { field: 'created', headerName: 'Created', width: 110 },
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
        { id: 1, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 2, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 3, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 4, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 5, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 6, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 7, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 8, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 9, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },
        { id: 10, projectName: 'Moverick Media Monitering', taskName: 'Moverick Media Monitering long project description provide by client', taskPriority: "Hight", taskDuration: "3 Hour", taskOwners: "Ankit Kumar Thakur, Name 1, Name 2, Name 3,Name 4, Name 5", task_status: "Active", created: "24 June 24" },

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
                                            <Link to={"/user/create-task"}><Fab color="primary" style={{ float: "right",zIndex:"auto" }} size="small" aria-label="add">
                                                <AddIcon />
                                            </Fab></Link>
                                        </div>
                                    </div>
                                    <Container className='m-0 p-0' maxWidth="lg">
                                        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                                            <Table aria-label="sticky table" >
                                                <TableHead>
                                                    <TableRow>
                                                        {columns.map((column) => (
                                                            <TableCell
                                                                key={column.id}
                                                                align="left"
                                                                style={{ top: 57, minWidth: column.width }}
                                                            >
                                                                {column.headerName}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.map((row) => (
                                                        <TableRow
                                                            key={row.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            {/* <TableCell component="th" scope="row">
                                                                {row.id}
                                                            </TableCell> */}
                                                            <TableCell align="left">{row.projectName}</TableCell>
                                                            <TableCell align="left">{row.taskName}</TableCell>
                                                            <TableCell align="left">{row.taskPriority}</TableCell>
                                                            <TableCell align="left">{row.taskDuration}</TableCell>
                                                            <TableCell align="left">{row.taskOwners}</TableCell>
                                                            <TableCell align="left">
                                                                <select className='form-select form-select-sm custom-select-wrapper'>
                                                                    <option>Cancelled</option>
                                                                    <option>Done</option>
                                                                    <option>Cancelled</option>
                                                                    <option>Done</option>
                                                                    <option>Cancelled</option>
                                                                    <option>Done</option>
                                                                    <option>Cancelled</option>
                                                                    <option>Done</option>
                                                                </select>
                                                                {/* <FormControl fullWidth size="small">
                                                                    <InputLabel id="demo-simple-select-label">Task Status</InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        value={20}
                                                                        label="Task Status"
                                                                        // onChange={handleChange}
                                                                    >
                                                                        <MenuItem value={10}>Pending</MenuItem>
                                                                        <MenuItem value={20}>Cancelled</MenuItem>
                                                                        <MenuItem value={30}>Done</MenuItem>
                                                                    </Select>
                                                                </FormControl> */}
                                                            </TableCell>
                                                            <TableCell align="left">{row.created}</TableCell>
                                                            <TableCell align="right"><Link><EditIcon></EditIcon></Link></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
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