import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return <>
        {/* Footer start */}
        <div className="footer">
            <div className="copyright">
                <p>Copyright © Designed &amp; Developed by
                    <Link to={"/test"} target="_blank">DexignLab</Link> 2024
                </p>
            </div>
        </div>
        {/* Footer end */}
    </>;
}