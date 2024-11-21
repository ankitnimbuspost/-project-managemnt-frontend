import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Autocomplete, Card, CardContent, CardHeader, FormControl, FormLabel, Icon, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import { useRef, useState } from 'react'
import callApis from '../../services/CallAPI';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {convertBase64,authenticateUser} from "../../services/CommonFunction"


function Profile() {
  const fNameRef = useRef(null);
  const lNameRef = useRef(null);
  const job_titleRef = useRef(null);
  const deptRef = useRef(null);
  const addressRef = useRef(null);
  const submitRef = useRef(null);

  const [errorState, setErrorState] = useState("");
  const [successState, setSuccessState] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  React.useEffect(()=>{
    if(!authenticateUser())
      window.location.href = '/signin';
  });

  const handleSubmit = async (event) => {

    event.preventDefault();
    if (fNameRef.current.value === '') {
      setErrorState("Please fill First Name.")
      fNameRef.current.focus();
    }
    else if (lNameRef.current.value === '') {
      setErrorState("Please fill Last Name.")
      lNameRef.current.focus();
    }
    else if (job_titleRef.current.value === '') {
      setErrorState("Please fill Job Title.")
      job_titleRef.current.focus();
    }
    else if(deptRef.current.value==='')
    {
      setErrorState("Please fill Department.");
      deptRef.current.focus();
    }
    else if(addressRef.current.value==='')
    {
      setErrorState("Please fill Complete Address");
      addressRef.current.focus();
    }
    else {
      submitRef.current.style.backgroundColor = 'cadetblue';
      submitRef.current.innerHTML = 'Please wait...';
      submitRef.current.disabled = true;
  
      let request = {
        'f_name': fNameRef.current.value,
        'l_name': lNameRef.current.value,
        'job_title': job_titleRef.current.value,
        "department": deptRef.current.value,
        "address": deptRef.current.value,
      }
      if(selectedFile!=null)
        request.profile_image = await convertBase64(selectedFile)
      let resp = await callApis.callUserMicroPostApi("update-profile", request);
      if (resp.code === 200) {
        setErrorState('')
        setSuccessState("Profile successfully updated.");
        setTimeout(()=>{
          window.location.reload()
        },2000)
      }
      else {
        setErrorState(resp.message);
        submitRef.current.style.backgroundColor = '#1976d2';
        submitRef.current.innerHTML = 'Update Profile';
        submitRef.current.disabled = false;
      }
    }
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Implement your file upload logic here
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      // You can send the selectedFile to your server using fetch or any other method
    }
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
                <CardHeader title="Update Profile" />
                <CardContent>
                  <Container style={{ paddingLeft: "5px" }} maxWidth="lg">
                    <Box
                      sx={{
                        marginTop: 1,
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
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              inputRef={fNameRef}
                              autoComplete="given-name"
                              name="firstName"
                              required
                              fullWidth
                              label="First Name"
                              autoFocus
                            />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              inputRef={lNameRef}
                              autoComplete="given-name"
                              name="lastName"
                              required
                              fullWidth
                              label="Last Name"
                              autoFocus
                            />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              inputRef={job_titleRef}
                              autoComplete="given-name"
                              name="lastName"
                              required
                              fullWidth
                              label="Job Title"
                              autoFocus
                            />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              inputRef={deptRef}
                              autoComplete="given-name"
                              name="lastName"
                              required
                              fullWidth
                              label="Department"
                              autoFocus
                            />
                          </Grid>
                        
                          <Grid item xs={12} md={6} lg={6}>
                            <TextField
                              inputRef={addressRef}
                              autoComplete="given-name"
                              required
                              fullWidth
                              label="Address"
                              autoFocus
                            />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <InputLabel htmlFor="task_desc">Profile Image</InputLabel>
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
                            {selectedFile ?  (
                              <div>
                                <p>Selected File: {selectedFile.name}</p>
                                {/* <Button variant="contained" onClick={handleUpload}>Upload File</Button> */}
                              </div>
                            ) : null}
                          </Grid>

                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              ref={submitRef}
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                            >Update Profile</Button>
                            <Button
                              type="button"
                              color="warning"
                              variant="contained"
                              sx={{ mt: 3, mb: 2, ml: 2 }}
                              onClick={()=>navigate('/user/project-dashboard')}
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
export default Profile;