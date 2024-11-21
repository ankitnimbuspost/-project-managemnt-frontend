import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useRef,useState } from 'react';
import { Alert } from '@mui/material';
import callApis from '../../services/CallAPI';

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

export default function Signin() {
    let navigate = useNavigate();

    let emailRef = useRef(null);
    let passwordRef = useRef(null);
    let submitRef = useRef(null);

    const [errorState, setErrorState] = useState("");
    const [successState, setSuccessState] = useState("");
    const handleSubmit = async(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(emailRef.current.value);
        if (data.get('username') === '' || data.get('username') === null) {
            setErrorState("Please fill Username.")
            emailRef.current.focus();
        }
        else if (data.get('password') === '' || data.get('password') === null) {
            setErrorState("Please fill Password.")
            passwordRef.current.focus();
        }
        else
        {
            submitRef.current.style.backgroundColor = 'cadetblue';
            submitRef.current.innerHTML = 'Please wait...';
            submitRef.current.disabled = true;
            let request={
                'email': emailRef.current.value,
                'password': passwordRef.current.value,
            }
            console.log(request)
            let resp = await callApis.callPostApi("signin",request);
            console.log(resp)
            if(resp.code===200)
            {
                setErrorState('')
                setSuccessState("Successfully Logged in, Redirecting to dashboard please wait few seconds.");
                sessionStorage.setItem('user', JSON.stringify(resp.data));
                setTimeout(() => {
                    // navigate('/user/project-dashboard');
                    window.location.href = '/user/project-dashboard';
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
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
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
                            Sign in
                        </Typography>
                        {errorState ?
                            <Alert variant="filled" style={{ marginTop: "0.5rem", width: "100%" }} severity="warning">
                                {errorState}
                            </Alert>
                            : ''}
                        {successState ?
                            <Alert variant="filled" style={{ marginTop: "0.5rem", width: "100%" }} severity="success">
                                {successState}
                            </Alert>
                            : ''}
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                label="Username"
                                fullWidth
                                id="username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                inputRef={emailRef}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                inputRef={passwordRef}
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                ref={submitRef}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link component={RouterLink} to={"/forgot-password"} variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link component={RouterLink} to={"/signup"} variant="body2">
                                        {"Don't have an account? Sign Up"}
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