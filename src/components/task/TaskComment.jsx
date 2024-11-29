import React from "react";

function TaskComment(props) {
    return <>
        <div id="my-posts" className="tab-pane fade active show">
            <div className="my-post-content pt-3">
                <div className="post-input">
                    <textarea name="textarea" id="textarea" cols="30" rows="5" className="form-control bg-transparent" placeholder="Please type what you want...."></textarea>
                    <a href="javascript:void(0);" className="btn btn-primary light me-1 px-3" data-bs-toggle="modal" data-bs-target="#linkModal"><i className="fa fa-link m-0"></i> </a>
                </div>

            </div>
        </div>
    </>;
}

export default TaskComment;