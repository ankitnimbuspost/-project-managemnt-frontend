import React, { useState } from "react";
import { Link } from "react-router-dom";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import BugReportIcon from '@mui/icons-material/BugReport';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Chat } from "@mui/icons-material";

export default function Sidebar() {
    const [menu,setMenu] = useState('home');
    function setActiveMenu(new_menu)
    {
        if(menu==new_menu)
            setMenu('xyz');
        else
            setMenu(new_menu);
        console.log("set menu clicked");
    }
    return <>
        {/* Sidebar start */}
        <div className="dlabnav">
            <div className="dlabnav-scroll">
                <ul className="metismenu" id="menu">
                    <li className={menu==='dashboard' ? 'mm-active' : ''}>
                        <Link to={"project-dashboard"} onClick={()=>setActiveMenu('dashboard')}>
                            <DashboardCustomizeIcon style={{color:'#96a0af'}}/>
                            <span className="nav-text">Dashboard</span>
                        </Link>
                    </li>
                    <li className={menu==='tasks' ? 'mm-active' : ''}>
                        <Link className="has-arrow " onClick={()=>setActiveMenu('tasks')} to={"#"} ariaExpanded={menu==='tasks' ? 'true' : 'false'}>
                            <TaskAltIcon style={{color:'#96a0af'}}/>
                            <span className="nav-text">Tasks</span>
                        </Link>
                        <ul ariaExpanded="false" className={menu==='tasks' ? 'mm-collapse  mm-show' : 'mm-collapse'}>
                            <li>
                                <Link to={"project-dashboard"}>Kanban</Link>
                            </li>
                            <li>
                                <Link to={"tasks"}>All Tasks</Link>
                            </li>
                            <li>
                                <Link to={"tasks"}>My Tasks</Link>
                            </li>
                        </ul>
                    </li>
                    <li className={menu==='issues' ? 'mm-active' : ''}>
                        <Link className="has-arrow " onClick={()=>setActiveMenu('issues')} to={"#"} ariaExpanded={menu==='issues' ? 'true' : 'false'}>
                           <BugReportIcon style={{color:'#96a0af'}}/>
                            <span className="nav-text">Issues</span>
                        </Link>
                        <ul ariaExpanded="true" className={menu==='issues' ? 'mm-collapse  mm-show' : 'mm-collapse'}>
                            <li>
                                <Link to={"tasks"}>All Issues</Link>
                            </li>
                            <li>
                                <Link to={"tasks"}>My Issues</Link>
                            </li>
                        </ul>
                    </li>
                    <li className={menu==='projects' ? 'mm-active' : ''}>
                        <Link to={"projects"} onClick={()=>setActiveMenu('projects')}>
                            <AccountTreeIcon style={{color:'#96a0af'}}></AccountTreeIcon>
                            <span className="nav-text">Projects</span>
                        </Link>
                    </li>
                    <li className={menu==='messages' ? 'mm-active' : ''}>
                        <Link to={"messages"} onClick={()=>setActiveMenu('messages')}>
                            <Chat style={{color:'#96a0af'}}></Chat>
                            <span className="nav-text">Chats</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>

        {/* Sidebar end */}
    </>;
}