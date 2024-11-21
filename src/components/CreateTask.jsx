import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Autocomplete, Card, CardContent, CardHeader, FormControl, FormLabel, Icon, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import callApis from '../services/CallAPI';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { authenticateUser } from '../services/CommonFunction';

const defaultTheme = createTheme();

function CreateTask() {
    const projectRef = useRef(null);
    const taskNameRef = useRef(null);
    const workHourRef = useRef(null);
    const unitRef = useRef(null);
    const priorityRef = useRef(null);
    const submitRef = useRef(null);

    const [errorState, setErrorState] = useState("");
    const [successState, setSuccessState] = useState("");
    const [editorData, setEditorData] = useState('');
    const [project, setProject] = React.useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [unit, setUnit] = useState('');
    const [tags, setTags] = useState([]);
    const [priority,setPriority] = useState('')
    const [owners,setOwners] = useState([])
    const [ownersData, setOwnersData] = useState([{ label: 'Option 1', value: 'option1' }]);

    const navigate = useNavigate();
    
    // On load Use useEffect
    React.useEffect(() => {
        if(!authenticateUser())
          window.location.href = '/signin';
        // This Function Get all project owners through APIs 
        const getAllOwners = async()=>{
            let user = JSON.parse(sessionStorage.getItem("user"));
            let request = {
                "company_name":user.company_name
            };
            let resp = await callApis.callUserMicroPostApi("user-company-wise",request);
            if(resp.code==200)
            {
                let project_owners = [];
                resp.data.forEach((owner)=>{
                    project_owners.push({label:owner.f_name+" "+owner.l_name,value:owner._id});
                });
                setOwnersData(project_owners)
            }
        }
        // This Function Get all projects through APIs 
        const getAllProjects = async()=>{
            let user = JSON.parse(sessionStorage.getItem("user"));
            let request = {
                "company_name":user.company_name
            };
            let resp = await callApis.callUserMicroPostApi("user-company-wise",request);
            if(resp.code==200)
            {
                let project_owners = [];
                resp.data.forEach((owner)=>{
                    project_owners.push({label:owner.f_name+" "+owner.l_name,value:owner._id});
                });
                setOwnersData(project_owners)
            }
        }
        getAllOwners();
    },[]);
    const handleSubmit = async (event) => {
        // console.log(owners)
        event.preventDefault();
        if (project === '') {
            setErrorState("Please Select Project Name.");
            projectRef.current.focus();
        }
        else if (taskNameRef.current.value === '') {
            setErrorState("Please fill Task Name.")
            taskNameRef.current.focus();
        }
        else if (editorData === '') {
            setErrorState("Please fill Task Description.")
        }
        else if (workHourRef.current.value === '') {
            setErrorState("Please fill Work hour.")
            workHourRef.current.focus();
        }
        else if (unitRef.current.value === '') {
            setErrorState("Please select work hour unit.")
            unitRef.current.focus();
        }
        else if (priorityRef.current.value === '') {
            setErrorState("Please select priority.")
            priorityRef.current.focus();
        }
        else {
            
            submitRef.current.style.backgroundColor = 'cadetblue';
            submitRef.current.innerHTML = 'Please wait...';
            submitRef.current.disabled = true;
            let all_owners = [];
            owners.forEach((owner)=>{
                all_owners.push(owner.value);
            })
            let request = {
                "project_id":"project",
                "task_name": taskNameRef.current.value,
                "task_desc": editorData,
                "status":1,
                "start_date" :"",
                "due_date" : "",
                "tags":tags,
                "owners":all_owners,
                "duration":{
                    "unit": workHourRef.current.value,
                    "value":unitRef.current.value
                },
                "complete_per":0,
                "priority":priorityRef.current.value,
                "task_status":"open"
            }
            console.log(request)

            let resp = await callApis.callTaskMicroPostApi("create-task", request);
            if (resp.code === 200) {
                setErrorState('')
                setSuccessState("Successfully task created.");
                setTimeout(() => {
                    navigate('/project-dashboard');
                }, 2000);
            }
            else {
                setErrorState(resp.message);
                submitRef.current.style.backgroundColor = '#1976d2';
                submitRef.current.innerHTML = 'CREATE TASK';
                submitRef.current.disabled = false;
            }
        }
    };
    const handleEditorChange = async (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
    };
    const handleProjectChange = (event) => {
        setProject(event.target.value);
    };
    const handlePriorityChange = (event) =>{
        setPriority(event.target.value);
    }
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleTagsChange = (event, newTags) => {
        setTags(newTags);
    };
    const handleOwnersChange = (event,Newowners)=>{

        setOwners(Newowners)
    }
    const handleUpload = () => {
        // Implement your file upload logic here
        if (selectedFile) {
            console.log("Uploading file:", selectedFile);
            // You can send the selectedFile to your server using fetch or any other method
        }
    };
    const handleUnitChange = (event) => {
        setUnit(event.target.value);
    };
    return (
        <>
            {/* Content body start */}
            <div className="content-body">
                {/* <!-- row --> */}
                <div className="container-fluid">
                    <div className='row'>
                        <div className='col-12'>
                            <Card>
                                <CardHeader title="Create a new Task" />
                                <CardContent>
                                    <Container style={{ paddingLeft: "5px" }} maxWidth="lg">
                                        <Box
                                            sx={{
                                                marginBottom: 1,
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
                                                    <Grid item xs={12} sm={12} lg={12}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Select Project</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                label="Select Project"
                                                                inputRef={projectRef}
                                                                value={project}
                                                                onChange={handleProjectChange}
                                                            >
                                                                <MenuItem value={10}>Ten</MenuItem>
                                                                <MenuItem value={20}>Twenty</MenuItem>
                                                                <MenuItem value={30}>Thirty</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={12}>
                                                        <TextField
                                                            inputRef={taskNameRef}
                                                            autoComplete="given-name"
                                                            name="firstName"
                                                            required
                                                            fullWidth
                                                            id="firstName"
                                                            label="Task Title/Task Name"
                                                            autoFocus
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={12}>
                                                        <InputLabel htmlFor="task_desc">Task Description</InputLabel>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            id={"task_desc"}
                                                            data={editorData}
                                                            onChange={handleEditorChange}
                                                        />
                                                        {/* <div dangerouslySetInnerHTML={{ __html: editorData }} /> */}

                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={12}>
                                                        <InputLabel htmlFor="task_desc">Attachment</InputLabel>
                                                        <input
                                                            accept="image/*" // Specify accepted file types here
                                                            type="file"
                                                            id="file-upload"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                        />
                                                        <label htmlFor="file-upload">
                                                            <Button
                                                                variant="contained"
                                                                component="span"
                                                                startIcon={<CloudUploadIcon />}
                                                            >
                                                                Upload
                                                            </Button>
                                                        </label>
                                                        {selectedFile && (
                                                            <div>
                                                                <p>Selected File: {selectedFile.name}</p>
                                                                {/* <Button variant="contained" onClick={handleUpload}>Upload File</Button> */}
                                                            </div>
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} lg={12}>
                                                        <Autocomplete
                                                            multiple
                                                            id="select2"
                                                            value={owners}
                                                            onChange={handleOwnersChange}
                                                            options={ownersData}
                                                            getOptionLabel={(option) => option.label}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="outlined"
                                                                    label="Owner"
                                                                    placeholder="Select Project Owner"
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Work Hours"
                                                            type="number"
                                                            inputRef={workHourRef}
                                                            style={{ marginRight: '16px' }}
                                                        />
                                                        <TextField
                                                            style={{width:'50%'}}
                                                            select
                                                            label="Unit"
                                                            value={unit}
                                                            inputRef={unitRef}
                                                            onChange={handleUnitChange}
                                                        >
                                                            <MenuItem value="hours">Hours</MenuItem>
                                                            <MenuItem value="days">Days</MenuItem>
                                                            <MenuItem value="weeks">Weeks</MenuItem>
                                                        </TextField>

                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Select Priority</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                inputRef={priorityRef}
                                                                onChange={handlePriorityChange}
                                                                label="Select Priority"
                                                                value={priority}
                                                            >
                                                                <MenuItem value={'none'}>None</MenuItem>
                                                                <MenuItem value={'low'}>Low</MenuItem>
                                                                <MenuItem value={'medium'}>Medium</MenuItem>
                                                                <MenuItem value={'high'}>High </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Autocomplete
                                                            multiple
                                                            id="tags-input"
                                                            options={[]}
                                                            freeSolo
                                                            value={tags}
                                                            onChange={handleTagsChange}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    variant="outlined"
                                                                    label="Tags"
                                                                    placeholder="Add tags"
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                    
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Button
                                                            type="submit"
                                                            ref={submitRef}
                                                            variant="contained"
                                                            sx={{ mt: 3, mb: 2 }}
                                                        >Create Task</Button>
                                                        <Button
                                                            type="button"
                                                            color="warning"
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
export default CreateTask;