import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, FormControl, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import { useRef,useState } from 'react'
import callApis from '../../services/CallAPI';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Signup() {
    const fNameRef = useRef(null);
    const lNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);
    const termConRef = useRef(null);
    const genderMaleRef = useRef(null);
    const genderFemaleRef = useRef(null);
    const genderOtherRef = useRef(null);
    const submitRef = useRef(null);

    const [errorState,setErrorState] = useState("");
    const [successState,setSuccessState] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (fNameRef.current.value === '') {
            setErrorState("Please fill First Name.")
            fNameRef.current.focus();
        }
        else if (lNameRef.current.value === '') {
            setErrorState("Please fill Last Name.")
            lNameRef.current.focus();
        }
        else if (emailRef.current.value === '') {
            setErrorState("Please fill Email ID.")
            emailRef.current.focus();
        }
        else if (phoneRef.current.value === '') {
            setErrorState("Please fill Phone Number.")
            phoneRef.current.focus();
        }
        else if (passwordRef.current.value === '') {
            setErrorState("Please fill Password.")
            passwordRef.current.focus();
        }
        else if (!genderMaleRef.current.checked && !genderFemaleRef.current.checked && !genderOtherRef.current.checked) {
            setErrorState("Please select Gender.")
            genderMaleRef.current.focus();
        }
        else if (data.get('term_condition') === null) {
            setErrorState("Please check Terms & Conditions.")
            termConRef.current.focus();
        }
        else {
            submitRef.current.style.backgroundColor = 'cadetblue';
            submitRef.current.innerHTML = 'Please wait...';
            submitRef.current.disabled = true;
            let gender = "";
            if(genderMaleRef.current.checked)
                gender = genderMaleRef.current.value
            else if(genderFemaleRef.current.checked)
                gender = genderFemaleRef.current.value
            else
                gender = genderOtherRef.current.value
            let request={
                'f_name': fNameRef.current.value,
                'l_name': lNameRef.current.value,
                'email': emailRef.current.value,
                'phone': phoneRef.current.value,
                'password': passwordRef.current.value,
                'gender':gender
            }
            
            let resp = await callApis.callPostApi("signup",request);
            if(resp.code===200)
            {
                setErrorState('')
                setSuccessState("Successfully registered, We are setting up your account please wait for few seconds");
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
            else
            {
                setErrorState(resp.message);
                submitRef.current.style.backgroundColor = '#1976d2';
                submitRef.current.innerHTML = 'SIGN UP';
                submitRef.current.disabled = false;
            }
        }
    };
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {errorState ? 
                        <Alert variant="filled" style={{marginTop:"0.5rem",width:"100%"}} severity="warning">
                        {errorState}
                    </Alert>
                    : ''}
                    {successState ? 
                        <Alert variant="filled" style={{marginTop:"0.5rem",width:"100%"}} severity="success">
                        {successState}
                    </Alert>
                    : ''}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputRef={fNameRef}
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputRef={lNameRef}
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputRef={emailRef}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputRef={phoneRef}
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    name="phone"
                                    autoComplete="phone"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputRef={passwordRef}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="female" control={<Radio inputRef={genderFemaleRef} name='gender' />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio name='gender' inputRef={genderMaleRef} />} label="Male" />
                                        <FormControlLabel value="other" control={<Radio name='gender' inputRef={genderOtherRef} />} label="Other" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: "0px" }}>
                                <FormControlLabel
                                    control={<Checkbox inputRef={termConRef} value="yes" name='term_condition' color="primary" />}
                                    label="I accept the terms & conditions."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            ref={submitRef}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to={"/signin"} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}