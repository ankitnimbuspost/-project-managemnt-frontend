import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useRef,useState } from 'react';
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

export default function ForgotPassword() {
    let navigate = useNavigate();

    let emailRef = useRef(null);
    let submitRef = useRef(null);

    const [errorState, setErrorState] = useState("");
    const [successState, setSuccessState] = useState("");
    const handleSubmit = async(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data.get('username') === '' || data.get('username') === null) {
            setErrorState("Please fill Username.")
            emailRef.current.focus();
        }
        else
        {
            submitRef.current.style.backgroundColor = 'cadetblue';
            submitRef.current.innerHTML = 'Please wait...';
            submitRef.current.disabled = true;
            let request={
                'email': emailRef.current.value,
            }
            let resp = await callApis.callPostApi("forgot-password",request);
            console.log(resp)
            if(resp.code===200)
            {
                setErrorState('')
                setSuccessState("OTP sent your email successfully.");
                sessionStorage.setItem('user', JSON.stringify(resp.data));
                setTimeout(() => {
                    navigate('/reset-password');
                }, 2000);
            }
            else
            {
                setErrorState(resp.message);
                submitRef.current.style.backgroundColor = '#1976d2';
                submitRef.current.innerHTML = 'Continue';
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
                            <QuestionMark />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Forgot Password
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
                        <Box component="form" noValidate onSubmit={handleSubmit} sm={{mt:1}} style={{width:'100%'}}>
                            <TextField
                                margin="normal"
                                required
                                label="Username"
                                fullWidth
                                id="username"
                                name="username"
                                variant="outlined"
                                autoComplete="username"
                                autoFocus
                                type='email'
                                inputRef={emailRef}
                            />
                            
                            
                            <Button
                                type="submit"
                                ref={submitRef}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className='btn-rounded'
                            >
                            Continue
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