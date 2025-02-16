import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Card, CardContent, CardHeader, FormControl,InputLabel, MenuItem, Select } from '@mui/material';
import { useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import callApis from '../services/CallAPI';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../services/CommonFunction';

const defaultTheme = createTheme();

function CreateProject() {
    const projectNameRef = useRef(null);
    const projectDescRef = useRef(null);
    const submitRef = useRef(null);

    const [errorState, setErrorState] = useState("");
    const [successState, setSuccessState] = useState("");
    const [editorData, setEditorData] = useState('');
    const [project, setProject] = React.useState('');
    const [projectStatus, setProjectStatus] = useState('');

    const navigate = useNavigate();
    React.useEffect(()=>{
        if(!authenticateUser())
          window.location.href = '/signin';
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (projectNameRef.current.value === '') {
            setErrorState("Please fill Project Title/Name.")
            projectNameRef.current.focus();
        }
        else if (projectStatus === '') {
            setErrorState("Please select Project Status.")
        }
        else if (editorData === '') {
            setErrorState("Please fill project description.")
            // projectDescRef.current.focus();
        }
        else {
            submitRef.current.style.backgroundColor = 'cadetblue';
            submitRef.current.innerHTML = 'Please wait...';
            submitRef.current.disabled = true;
    
            let request = {
                'project_name': projectNameRef.current.value,
                'project_desc': editorData,
                'status': projectStatus,
            }

            let resp = await callApis.callTaskMicroPostApi("create-project", request);
            if (resp.code === 200) {
                setErrorState('')
                setSuccessState(resp.message);
                setTimeout(() => {
                    navigate('/user/project-dashboard');
                }, 2000);
            }
            else {
                setErrorState(resp.message);
                submitRef.current.style.backgroundColor = '#1976d2';
                submitRef.current.innerHTML = 'CREATE PROJECT';
                submitRef.current.disabled = false;
            }
        }
    };
    const handleEditorChange = async (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
    };
    const handleStatusChange = (event) => {
        setProjectStatus(event.target.value);
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
                                <CardHeader title="Create a new Project" />
                                <CardContent>
                                    <Container style={{ paddingLeft: "5px" }} maxWidth="lg">
                                        <Box
                                            sx={{
                                                marginTop: 0,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {errorState ?
                                                <Alert variant="filled" style={{ marginBottom: "1rem", width: "100%" }} severity="warning">
                                                    {errorState}
                                                </Alert>
                                                : ''}
                                            {successState ?
                                                <Alert variant="filled" style={{ marginBottom: "1rem", width: "100%" }} severity="success">
                                                    {successState}
                                                </Alert>
                                                : ''}
                                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 0 }} lg={{ mt: 0 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={12} lg={6} md={6}>
                                                        <TextField
                                                            inputRef={projectNameRef}
                                                            autoComplete="given-name"
                                                            name="projectName"
                                                            required
                                                            fullWidth
                                                            id="projectName"
                                                            label="Project Title/Project Name"
                                                            autoFocus
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={12} lg={6} md={6}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Select Project Status</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={projectStatus}
                                                                label="Select Project Status"
                                                                onChange={handleStatusChange}
                                                            >
                                                                <MenuItem value={1}>Active</MenuItem>
                                                                <MenuItem value={0}>InActive</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={12} lg={12}>
                                                        <InputLabel htmlFor="task_desc">Task Description</InputLabel>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            id={"task_desc"}
                                                            inputRef={projectDescRef}
                                                            data={editorData}
                                                            onChange={handleEditorChange}
                                                        />
                                                        {/* <div dangerouslySetInnerHTML={{ __html: editorData }} /> */}

                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Button
                                                            type="submit"
                                                            ref={submitRef}
                                                            variant="contained"
                                                            sx={{ mt: 3, mb: 2 }}
                                                        >Create Project</Button>
                                                        <Button
                                                            type="button"
                                                            color="warning"
                                                            ref={submitRef}
                                                            variant="contained"
                                                            sx={{ mt: 3, mb: 2, ml: 2 }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Grid>
                                                </Grid>


                                            </Box>
                                        </Box>
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