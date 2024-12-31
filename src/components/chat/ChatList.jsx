import React, { Suspense, lazy } from "react";
import {convertChatDateTime} from "../../services/CommonFunction"
const ShowChatFiles = lazy(() => import("./ShowChatFiles"));
export default function ChatList({ messages, loginUser }) {
    return (
        <>
            {messages.length > 0 ? (
                messages.map((msg, index) => {
                    // If isSender true then message show end position(Sender) otherwise show left side(Resceiver)
                    const isSender = msg.sender_id === loginUser._id;
                    const className = isSender ? "justify-content-end align-items-end" : "justify-content-start align-items-start";
                    const colorType = isSender ? "message-sent" : "message-received";
                    const avatarImage = isSender ? "/assets/images/contacts/3.jpg" : "/assets/images/group/g1.jpg"; // Sender vs. Receiver image

                    return (
                        <div key={msg._id || index} className={`media my-4 ${className}`}>
                            {!isSender && (
                                <div className="image-box me-sm-1 me-2">
                                    <img src={avatarImage} alt="" className="rounded-circle img-1" />
                                    <span className="active1"></span>
                                </div>
                            )}

                            <div className={colorType}>
                                {msg.message_type.toLowerCase() === "text" ? (
                                    <p className="mb-1">{msg.message}</p>
                                ) : (
                                    <Suspense fallback={<div>Loading file...</div>}> <ShowChatFiles file={msg} /></Suspense>
                                )}
                                <span className="fs-12">{convertChatDateTime(msg.created)}</span>
                            </div>

                            {isSender && (
                                <div className="image-box ms-sm-1 ms-2 mb-4">
                                    <img src={avatarImage} alt="" className="rounded-circle img-1" />
                                    <span className="active"></span>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <center>
                    <p>No communication yet</p>
                </center>
            )}
        </>
    );
}