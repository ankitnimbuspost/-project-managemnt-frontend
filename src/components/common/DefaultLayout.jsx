import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout() {
    return <>
    <div id="main-wrapper">
    <Outlet/>
    </div>
      
    </>;
}