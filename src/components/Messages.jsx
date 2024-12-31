import { Card, CardContent, Fab, Container, Box, Grid, Paper, Tooltip, Button, Typography } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { authenticateUser, formatFiles } from "../services/CommonFunction";
import "../css/chat-styling.css";
import $ from "jquery"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';
import UploadIcon from '@mui/icons-material/Upload';
import LayersIcon from '@mui/icons-material/Layers';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
const DisplayUploadedFiles = lazy(() => import("./chat/DisplayUploadedFiles"));
const DirectUserDialog = lazy(() => import("./chat/DirectUserDialog"));
const ChatList = lazy(() => import("./chat/ChatList"))

function Messages() {
    const user = authenticateUser();

    const [messages, setMessages] = useState([]);
    // const [message, setMessage] = useState('');
    const [loginUser, setLoginUser] = useState(user)
    const [toUserGroup, setToUserGroup] = useState({});
    const [isUser, setIsUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [directUserMessage, setDirectUserMessage] = useState(false);
    const socketRef = useRef(null);
    const fileInputRef = useRef(null);
    const messageTextRef = useRef(null);
    const messageScrollbarRef = useRef(null);
    const [files, setFiles] = useState([]);
    let backend_url = process.env.REACT_APP_SOCKET_URL ?? '';
    // For Connection Socket 
    useEffect(() => {
        console.log("user effect call 1");
        if (!authenticateUser())
            window.location.href = '/signin';
        // Only initialize the socket if it hasn't been initialized yet
        if (!socketRef.current) {
            socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
                extraHeaders: {
                    auth: user.access_token,
                },
            });
        }
    }, []); // Empty dependency array ensures this effect runs only once

    // Only for socket 
    useEffect(() => {
        console.log("user effect call 2");
        // getAllPrivateMessages('66b21db5874eedc1d745928d')
        getUserGroups();
        getUserList();
        getNewMessages();
        getLastChat();
    }, []);
    // Get User Listing 
    function getUserList() {
        socketRef.current.on("getDirectMessageUser", (data) => {
            setUsers(data.data);
        });
        // Cleanup listener on unmount
        return () => {
            socketRef.current.off("getDirectMessageUser");
        };
    }
    //Get User Groups
    function getUserGroups() {
        socketRef.current.on("getUserGroups", (data) => {
            setGroups(data.data);
        });
        // Cleanup listener on unmount
        return () => {
            socketRef.current.off("getUserGroups");
        };
    }
    // Get Last Chat User/Group 
    function getLastChat() {
        socketRef.current.emit("last_chat", {})
        // socketRef.current.off("last_chat");
        socketRef.current.once("last_chat", (data) => {
            let last_chat = data.response;
            if(last_chat.id && last_chat.type)
                setMessageTo(last_chat.id,last_chat.type);
        });
    }
    //Get New Messages When user send or receiver get message
    function getNewMessages() {
        socketRef.current.on("private_message", (data) => {
            let new_msg = data.response;
            setMessages((prevMsg) => [...prevMsg, new_msg]);
        });
    }
    //Get All Private Message Lists
    function getAllPrivateMessages(sender_id) {
        socketRef.current.emit('private_message_list', { sender_id: sender_id });
        // Remove any previous listener for "private_message_list"
        socketRef.current.off("private_message_list");

        socketRef.current.on('private_message_list', (msgList) => {
            console.info("private_message_list event call");
            console.log(msgList)
            setMessages(msgList.messages)
            if (messageScrollbarRef.current) {
                setTimeout(() => {
                    messageScrollbarRef.current.scrollTop = messageScrollbarRef.current.scrollHeight;
                }, 1000);
            }
        });
    }
    // Send Private Message 
    function sendPrivateMessage(message, message_type = "TEXT", send_to) {
        socketRef.current.emit("private_message", { send_to, message_type, message })
        // Remove any previous listener for "private_message"
        socketRef.current.off("private_message");
    }
    // This Function Set Message to User 
    function setMessageTo(user_group_id, type = 'user') {
        if (type == 'group')
            setIsUser(false);
        else
            setIsUser(true);
        socketRef.current.emit("get_to_data", { "id": user_group_id, "type": type });
        // Remove any previous listener for "get_to_data"
        socketRef.current.off("get_to_data");

        //Lster Data
        socketRef.current.on("get_to_data", (data) => {
            console.info("get_to_data event call");
            setToUserGroup(data.data);
            getAllPrivateMessages(user_group_id)
        });
    }
    function handleDirectMessageDialog() {
        setDirectUserMessage(directUserMessage + 1);
    }
    useEffect(() => {
        console.log("Use Effect Jquery call")
        $('#message_text').on('keydown', function (event) {
            if (event.key === "Enter" || event.which === 13) { // "Enter" key detected
                let message = $(this).val().trim();
                if (message != '') {
                    sendPrivateMessage(message, "TEXT", toUserGroup._id);
                    getNewMessages();
                }
                // Here Send Files if file exists 
                Array.from(files).forEach((file, index) => {
                    sendPrivateMessage(file.url, file.extension, toUserGroup._id);
                    getNewMessages();
                });
                setFiles([]);
                if (messageScrollbarRef.current) {
                    setTimeout(() => {
                        messageScrollbarRef.current.scrollTop = messageScrollbarRef.current.scrollHeight;
                    }, 2000);
                }
                $("#message_text").val("");
                // messageTextRef.current.value 
            }
        });
        return () => {
            $('#message_text').off('keydown');
        };
    });
    // for handle upload file 
    const handleUploadFileChange = (event) => {
        formatFiles(event.target.files).then((formattedFiles) => {
            console.log(formattedFiles)
            setFiles((prevFiles) => [...prevFiles, ...formattedFiles]);
            event.target.value = '';
        }).catch((e) => console.log(e.message));
    }
    const handleChildData = (data) => {
        setFiles(data); // Update parent's state
    };
    const handleDirectMessage = (data)=>{
        setMessageTo(data.id,data.type);
    }

    return (<>
        {/* Content body start */}
        <div className="content-body">
            {/* <!-- row --> */}
            <div className="container-fluid mt-1 pt-1 chat-container">
                <div className='row'>
                    <div className='col-12'>
                        <Card elevation={1} className="m-0 p-0">
                            <CardContent className="m-0 p-0">
                                <Container className='m-0 p-0' maxWidth="lg">
                                    <Grid container item spacing={0.5}>
                                        {/* User/Group Listing start  */}
                                        <Grid item lg={4} md={4} sm={12} className={files.length > 0 ? "list-container hightup" : "list-container"}>
                                            {directUserMessage ? <DirectUserDialog status={directUserMessage} onDataChange={handleDirectMessage}></DirectUserDialog> : ""}
                                            <Paper elevation={3}>
                                                <PerfectScrollbar
                                                    options={{
                                                        wheelSpeed: 2,
                                                        wheelPropagation: true,
                                                        minScrollbarLength: 200
                                                    }}
                                                    className={files.length > 0 ? "chart-container hightup m-0 p-0" : "chart-container m-0 p-0"}
                                                >
                                                    <div className="dlab-scroll chat-sidebar" style={{ height: "100%" }} id="chatSidebar">
                                                        <div className="d-flex align-items-center justify-content-between px-2">
                                                            <span className="m-3 d-block fs-16">GROUP</span>
                                                            <i className="fas fa-plus text-primary"></i>
                                                        </div>
                                                        <div className="px-3">
                                                            {groups.length > 0 ? <>
                                                                {groups.map((group, index) => (
                                                                    <div className="chat-bx-group px-2 d-flex align-items-center justify-content-between">
                                                                        <div className="user d-flex align-items-center">
                                                                            <a href="javascript:void(0);" className={`bg-team${Math.floor(Math.random() * 5) + 1}`}><i className="fas fa-user-friends"></i></a>
                                                                            <span className="fs-18 font-w500 ms-3">{group.name}</span>
                                                                        </div>
                                                                        {/* <i className="fas fa-thumbtack scale5"></i> */}
                                                                    </div>
                                                                ))}
                                                            </> : "Fetching Groups"}
                                                        </div>
                                                        <div className="recent-msg p-4 chat-bx">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="fs-16" style={{ fontWeight: "600" }}>RECENT MESSAGE</span>
                                                                <div className="dropdown ms-2">
                                                                    <div className="btn-link" data-bs-toggle="dropdown">
                                                                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <circle cx="12.4999" cy="3.5" r="2.5" fill="#000000" />
                                                                            <circle cx="12.4999" cy="11.5" r="2.5" fill="#000000" />
                                                                            <circle cx="12.4999" cy="19.5" r="2.5" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a className="dropdown-item" href="javascript:void(0)" onClick={handleDirectMessageDialog}>Direct Message</a>
                                                                        <a className="dropdown-item" href="javascript:void(0)">Delete</a>
                                                                        <a className="dropdown-item" href="javascript:void(0)">Edit</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            {users.length > 0 ? <>
                                                                {users.map((user, index) => (
                                                                    <div className="chat-bx user-listing border-bottom" onClick={() => setMessageTo(user._id)}>
                                                                        <div className="px-3 d-flex">
                                                                            <div className="chat-img">
                                                                                {user.profile_image != undefined && user.profile_image != '' ? <>
                                                                                    <img src={`${backend_url}/${user.profile_image}`} alt="" />
                                                                                    <span className="active"></span>
                                                                                </> : <>
                                                                                    <img src="/assets/images/contacts/pic22.jpg" alt="" />
                                                                                    <span className="active"></span>
                                                                                </>}
                                                                            </div>
                                                                            <div className="w-100">
                                                                                <div className="d-flex mb-1 align-items-center">
                                                                                    <span className="fs-16 text-black">{user.f_name + " " + user.l_name}</span>
                                                                                    {/* <span className="fs-12 ms-auto badge badge-primary">New</span> */}
                                                                                </div>
                                                                                <div>
                                                                                    <p className="mb-0" style={{ lineHeight: "0.7rem" }}>I remember that project</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </> : ""}
                                                        </div>
                                                    </div>
                                                </PerfectScrollbar>
                                            </Paper>
                                        </Grid>
                                        {/* End  */}
                                        {/* Chat Functionality Start  */}
                                        <Grid item lg={8} md={8} sm={12} className={files.length > 0 ? "msg-container hightup" : "msg-container"}>
                                            <Paper elevation={3}>
                                                <div className="d-flex justify-content-between align-items-center border-bottom px-3 pt-2 flex-wrap">
                                                    <div className="d-flex align-items-center pb-2">
                                                        <div className="fillow-design">
                                                            <a href="javascript:void(0);">{toUserGroup.profile_image != undefined && toUserGroup.profile_image != '' ? <>
                                                                <img src={`${backend_url}/${toUserGroup.profile_image}`} className="img-fluid profile-image" />
                                                            </> : <i class="fas fa-user-friends" />}</a>
                                                        </div>
                                                        <div className="ms-3">
                                                            <h4 className="fs-20 font-w700 m-0 p-0">{toUserGroup.f_name} {toUserGroup.l_name}</h4>
                                                            <div className="activity d-flex align-items-center pb-0 pt-0">
                                                                <ul className="d-flex">
                                                                    <li><a href="javascript:void(0);"><i className="fas fa-video"></i></a></li>
                                                                    <li><a href="javascript:void(0);"><i className="fas fa-search"></i></a></li>
                                                                    <li><a href="javascript:void(0);"><i className="fas fa-star text-orange"></i></a></li>
                                                                </ul>
                                                                <div className="dropdown ms-2">
                                                                    <div className="btn-link" data-bs-toggle="dropdown">
                                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <circle cx="12.4999" cy="3.5" r="2.5" fill="#000000" />
                                                                            <circle cx="12.4999" cy="11.5" r="2.5" fill="#000000" />
                                                                            <circle cx="12.4999" cy="19.5" r="2.5" fill="#000000" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a className="dropdown-item" href="javascript:void(0)">Delete</a>
                                                                        <a className="dropdown-item" href="javascript:void(0)">Edit</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="chat-box-area dlab-scroll chat-box-area" style={{ height: "330px" }} id="chatArea">
                                                    <div className="chat-box-area dz-scroll m-0 p-0" id="chartBox" style={{ height: "345px" }}>
                                                        <PerfectScrollbar
                                                            options={{
                                                                wheelSpeed: 2,
                                                                wheelPropagation: true,
                                                                minScrollbarLength: 200
                                                            }}
                                                            containerRef={(ref) => (messageScrollbarRef.current = ref)}
                                                        >
                                                            <Suspense fallback={<div>Loading chat...</div>}>
                                                                <ChatList messages={messages} loginUser={loginUser} />
                                                            </Suspense>
                                                        </PerfectScrollbar>
                                                    </div>
                                                </div>
                                                <div className="card-footer border-0 type-massage">
                                                    <div className="input-group">
                                                        <textarea className="form-control" ref={messageTextRef} id="message_text" rows="3" placeholder="Send to Ankit"></textarea>
                                                    </div>
                                                    <DisplayUploadedFiles onDataChange={handleChildData} data={files}></DisplayUploadedFiles>
                                                    {/* Message Button Footer Start  */}
                                                    <div className="row footer-buttons">
                                                        <div className="col-6 activity d-flex align-items-center pb-0 pt-0">
                                                            <div className="dropdown ms-2" style={{ marginRight: "14px" }}>
                                                                <div className="btn-link" data-bs-toggle="dropdown">
                                                                    <a href="#"><Tooltip title="Attach files"><AddCircleRoundedIcon ></AddCircleRoundedIcon></Tooltip></a>
                                                                </div>
                                                                <div className="dropdown-menu upload-dropdown dropdown-menu-right">
                                                                    <input type="file" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleUploadFileChange} />
                                                                    <a className="dropdown-item" onClick={() => fileInputRef.current.click()} href="#"><UploadIcon></UploadIcon> Upload from your computer</a>
                                                                    <a className="dropdown-item" href="#"><LayersIcon></LayersIcon> Recent files</a>
                                                                </div>
                                                            </div>
                                                            <ul className="d-flex">
                                                                <li><a href="#"><Tooltip title="Insert Emoji"><InsertEmoticonRoundedIcon></InsertEmoticonRoundedIcon></Tooltip></a></li>
                                                                <li><a href="#"><Tooltip title="Mention Someone"><AlternateEmailRoundedIcon></AlternateEmailRoundedIcon></Tooltip></a></li>
                                                                <li><a href="#"><Tooltip title="Run Shortcut"><ShortcutRoundedIcon ></ShortcutRoundedIcon></Tooltip></a></li>
                                                            </ul>
                                                        </div>
                                                        <div className="col-6 sent-button">
                                                            <Button size="small" color="success" id="send-button" variant="contained" href="#"><SendRoundedIcon fontSize="small" /></Button>
                                                        </div>
                                                    </div>
                                                    {/* Message Button Footer End  */}
                                                </div>
                                            </Paper>
                                        </Grid>
                                        {/* End  */}
                                    </Grid>
                                </Container>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
        {/* Content body end */}
    </>);
}

export default Messages;