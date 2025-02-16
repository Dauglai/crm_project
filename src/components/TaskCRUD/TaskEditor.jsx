import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function TaskEditor({ taskData, setTaskData }) {
    const handleChange = (value) => {
        setTaskData({ ...taskData, description: value });
    };

    return (
        <div className="form-block">
            <label>Описание:</label>
            <ReactQuill
                theme="snow"
                value={taskData.description}
                onChange={handleChange}
                modules={{
                    toolbar: [
                        [{ font: [] }, { size: [] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ script: "sub" }, { script: "super" }],
                        [{ align: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "video"],
                        ["clean"]
                    ],
                }}
            />
        </div>
    );
}

export default TaskEditor;