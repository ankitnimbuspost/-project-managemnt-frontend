import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box } from '@mui/material';

export default function DirectUserDialog(props) {
    const [open, setOpen] = React.useState(true);
    const [selectedUser, setSelectedUser] = React.useState(null);
    React.useEffect(() => {
        if (props.status) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [props.status]);
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
                        if(selectedUser==null){
                            alert("Please Choose User.");
                        }
                        else{
                            //CALL API
                            console.log(selectedUser)
                            handleClose();
                        }
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <Autocomplete
                        className='mt-2'
                        // id="Choose User"
                        sx={{ width: "100%" }}
                        options={countries}
                        autoHighlight
                        name="user"
                        id="user"
                        value={selectedUser}
                        onChange={(event, newValue) => setSelectedUser(newValue)}
                        getOptionLabel={(option) => option.label}
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
                                        srcSet={`https://tse2.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api&P=0&h=220 2x`}
                                        src={`https://tse2.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api&P=0&h=220`}
                                        alt=""
                                    />
                                    {option.label}
                                </Box>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose User..."
                                slotProps={{
                                    htmlInput: {
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    },
                                }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

const countries = [
    { code: 'AD', label: 'Andorra', phone: '376',user_id:1 },
    {
      code: 'AE',
      label: 'United Arab Emirates',
      phone: '971',
      user_id:2
    }
];