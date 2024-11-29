import React, { useEffect,useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar"
import Chatbox from "./Chatbox"
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import {authenticateUser} from "../../services/CommonFunction"

export default function Layout(props,{ children }) {
    const [navShow,setNavshow] = useState(null);
    useEffect(()=>{
        console.log("Layout call")
        console.log(props.props);
        if(props.props.role==='dashboard')
        {
            if(!authenticateUser())
            window.location.href = '/signin';
            setNavshow(props.props.role);
        }
        else
            setNavshow(null);
    },[props])
    return <>
        {navShow ?
            <>
            <div id="preloader">
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div id="main-wrapper">
                <Navbar></Navbar>
                <Chatbox></Chatbox>
                <Header></Header>
                <Sidebar></Sidebar>
                <Outlet /> 
                <Footer></Footer>
            </div>
        </>
        : <Outlet></Outlet> }
        { children }
    </>;
}