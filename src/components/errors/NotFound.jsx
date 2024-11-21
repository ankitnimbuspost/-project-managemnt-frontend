import React from "react";
import { useEffect } from "react";

function NotFound()
{
    useEffect(() => {
        console.log("use effect calls")
        let data = sessionStorage.getItem('user');
        console.log(JSON.parse(data));
    },[]);
    return<>
    <h1>Page Not Found</h1>
    </>;
}

export default NotFound;