import React, { lazy, useState } from "react";
const ShowChatFiles = lazy(() => import("./ShowChatFiles"))

export default function ChatList({ messages, loginUser }) {
    return (<>
        <div className={`media my-4 justify-content-end align-items-end`}>
            <div className="message-sent">
                <iframe
                    src={"https://www.microsoft.com/en-in/microsoft-365/free-office-online-for-the-web?legRedir=true&CorrelationId=2df3f9b5-b26c-4b9b-af72-dd99fc7ac004"}
                    width="100%"
                    height="500px"
                    frameBorder="0"
                    title="Link Preview"
                />
                <span className="fs-12">Sunday, October 24th, 2020  at 4.30 AM</span>
            </div>
            <div className="image-box ms-sm-1 ms-2 mb-4">
                <img src="/assets/images/contacts/3.jpg" alt="" className="rounded-circle img-1" />
                <span className="active"></span>
            </div>
        </div>
        {messages.length > 0 ? <>
            {messages.map((msg, index) => {
                let colorType = "message-received";
                let className = "justify-content-start align-items-start";
                if (msg.sender_id == loginUser._id) {
                    className = "justify-content-end align-items-end";
                    colorType = "message-sent";
                    //This Means getting data which is sent by me.
                    return (<>
                        <div className={`media my-4 justify-content-end align-items-end`}>
                            <div className="message-sent">
                                {["text"].includes(msg.message_type.toLowerCase()) ? <>
                                    <p className="mb-1">{msg.message}</p>
                                </> :
                                    <ShowChatFiles file={msg}></ShowChatFiles>
                                }
                                <span className="fs-12">Sunday, October 24th, 2020  at 4.30 AM</span>
                            </div>
                            <div className="image-box ms-sm-1 ms-2 mb-4">
                                <img src="/assets/images/contacts/3.jpg" alt="" className="rounded-circle img-1" />
                                <span className="active"></span>
                            </div>
                        </div>
                    </>);
                }
                else {
                    //This Means getting data which is sent by Other
                    return (<>
                        <div className={`media my-4 ${className}`}>
                            <div className="image-box me-sm-1 me-2">
                                <img src="/assets/images/group/g1.jpg" alt="" className="rounded-circle img-1" />
                                <span className="active1"></span>
                            </div>
                            <div className={`${colorType}`}>
                                {["text"].includes(msg.message_type.toLowerCase()) ? <>
                                    <p className="mb-1">{msg.message}</p>
                                </> :
                                    <ShowChatFiles file={msg}></ShowChatFiles>
                                }
                                <span className="fs-12">Sunday, October 24th, 2020  at 4.30 AM</span>
                            </div>
                        </div>
                    </>);
                }
            })}
        </> : <center><p>Not communication yet</p></center>}
    </>);
}