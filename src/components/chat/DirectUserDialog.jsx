import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box } from '@mui/material';
import callApis from '../../services/CallAPI';

export default function DirectUserDialog(props) {
    const [open, setOpen] = React.useState(true);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [users, setUsers] = React.useState([]);
    let backend_url = process.env.REACT_APP_SOCKET_URL ?? '';
    React.useEffect(() => {
        if (props.status) {
            setOpen(true);
        } else {
            setOpen(false);
        }
        //Now Get All Users through M1 API
        async function getUsers() {
            let resp = await callApis.callUserMicroPostApi("user-company-wise", {});
            return resp;
        }
        if (users.length == 0) {
            getUsers().then((data) => {
                setUsers(data.data)
            }).catch((err) => {
                console.log(err.message)
            });
        }
    }, [props.status, users]);
    const updateToParent = function (id, type) {
        // console.log(user_id,type)
        props.onDataChange({ id, type });
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        if (selectedUser == null) {
                            alert("Please Choose User.");
                        }
                        else {
                            //CALL API
                            callApis.callUserMicroPostApi("/set-direct-user-message", { "user_id": selectedUser._id }).then((resp) => {
                                if (resp.code === 200) {
                                    updateToParent(selectedUser._id, "user")
                                    handleClose()
                                } else {
                                    alert(resp.message);
                                }
                            }).catch((err) => {
                                console.log(err.message);
                            })
                        }
                    },
                }}
            >
                <DialogTitle>New Message</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        A popup dialog to send messages directly to a specific user. Select users from your organization and send them a message.
                    </DialogContentText>
                    <Autocomplete
                        className='mt-3'
                        // id="Choose User"
                        sx={{ width: "100%" }}
                        options={users}
                        autoHighlight
                        name="user"
                        id="user"
                        value={selectedUser}
                        onChange={(event, newValue) => setSelectedUser(newValue)}
                        getOptionLabel={(option) => option.f_name + " " + option.l_name}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <Box
                                    key={key}
                                    component="li"
                                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                    {...optionProps}
                                >
                                    <img
                                        loading="lazy"
                                        width="20"
                                        srcSet={option.profile_image ? backend_url + "/" + option.profile_image : `https://tse2.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api&P=0&h=220 2x`}
                                        src={option.profile_image ? backend_url + "/" + option.profile_image : `https://tse2.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api&P=0&h=220`}
                                        alt=""
                                    />
                                    {option.f_name + " " + option.l_name}
                                </Box>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose User..."
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions style={{marginRight:"1rem"}}>
                    <Button type="submit" variant="outlined" color='primary'>Direct Message</Button>
                    <Button onClick={handleClose} variant="outlined" color="warning">Cancel</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}