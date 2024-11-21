import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Alert } from '@mui/material';
import callApis from '../../services/CallAPI';
import { QuestionMark } from '@mui/icons-material';

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


const defaultTheme = createTheme();

export default function ResetPassword() {
    let navigate = useNavigate();

    let otpRef = useRef(null);
    let newPassRef = useRef(null);
    let confirmPassRef = useRef(null);
    let submitRef = useRef(null);

    const [errorState, setErrorState] = useState("");
    const [successState, setSuccessState] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (otpRef.current.value === '' || otpRef.current.value == null) {
            setErrorState("OTP field is required.")
            otpRef.current.focus();
        }
        else if (otpRef.current.value.length != 4) {
            setErrorState("OTP length must be 4 digit.")
            otpRef.current.focus();
        }
        else if (newPassRef.current.value === '') {
            setErrorState("New Password field is required.")
            newPassRef.current.focus();
        }
        else if (newPassRef.current.value.length < 8) {
            setErrorState("Password field must be at least 8 char long.")
            newPassRef.current.focus();
        }
        else if (confirmPassRef.current.value === '') {
            setErrorState("Confirm Password field is required.")
            confirmPassRef.current.focus();
        }
        else if (confirmPassRef.current.value != newPassRef.current.value) {
            setErrorState("New Password & Confirm Password not match.")
            confirmPassRef.current.focus();
        }
        else {
            submitRef.current.style.backgroundColor = 'cadetblue';
            submitRef.current.innerHTML = 'Please wait...';
            submitRef.current.disabled = true;
            let request = {
                // 'email': emailRef.current.value,
                'otp': otpRef.current.value,
                'new_password': newPassRef.current.value,
                'confirm_password': confirmPassRef.current.value,
            }
            let resp = await callApis.callPostApi("reset-password", request);
            if (resp.code === 200) {
                setErrorState('')
                setSuccessState("Your password reset successfully.");
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
            else {
                setErrorState(resp.message);
                submitRef.current.style.backgroundColor = '#1976d2';
                submitRef.current.innerHTML = 'Reset Password';
                submitRef.current.disabled = false;
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://images5.fanpop.com/image/photos/28000000/randomised-random-28065165-1024-819.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Reset Your Password
                        </Typography>
                        {errorState ? (
                            <Alert variant="filled" style={{ marginTop: "0.5rem", width: "100%" }} severity="warning">
                                {errorState}
                            </Alert>
                        ) : ''}
                        {successState ?
                            <Alert variant="filled" style={{ marginTop: "0.5rem", width: "100%" }} severity="success">
                                {successState}
                            </Alert>
                            : ''}
                        <Box component="form" noValidate onSubmit={handleSubmit} sm={{ mt: 1 }} className='mt-3' style={{ width: '100%' }}>
                            <TextField
                                required
                                label="OTP"
                                fullWidth
                                variant="outlined"
                                autoComplete="OTP"
                                autoFocus
                                type='number'
                                inputRef={otpRef}
                            />
                            <TextField
                                required
                                margin="normal"
                                label="New Password"
                                fullWidth
                                variant="outlined"
                                autoComplete="New Password"
                                autoFocus
                                type='password'
                                inputRef={newPassRef}
                            />
                            <TextField
                                required
                                margin="normal"
                                label="Confirm Password"
                                fullWidth
                                variant="outlined"
                                autoComplete="Confirm Password"
                                autoFocus
                                type='password'
                                inputRef={confirmPassRef}
                            />

                            <Button
                                type="submit"
                                ref={submitRef}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className='btn-rounded'
                            >
                                Reset Password
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link component={RouterLink} to={"/signin"} variant="body2">
                                        {"Already have an account? Sign in"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}