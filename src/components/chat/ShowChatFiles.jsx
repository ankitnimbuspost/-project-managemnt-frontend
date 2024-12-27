import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";

export default function ShowChatFiles({ file }) {
    const renderPreview = () => {
        const fileExtension = file.message_type.toLowerCase();
        switch (fileExtension) {
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "webp":
                return (
                    <img
                        src={file.message}
                        alt={file.message_type + " file"}
                        loading="lazy"
                        style={{
                            width: "100%", // Full width of container
                            height: "auto", // Maintain aspect ratio
                            objectFit: "cover", // Ensures the image covers the container area
                            maxHeight: "300px", // Optional: Limit the maximum height
                        }}
                    />
                );
            case "pdf":
                return (
                    <iframe
                        src={file.message}
                        alt={file.message_type + " file"}
                        style={{
                            width: "100%",
                            height: "250px",
                            border: "none",
                        }}
                    />
                );
            case "mp4":
            case "webm":
            case "mov":
                return (
                    <video
                        controls
                        src={file.message}
                        style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "300px",
                        }}
                    />
                );
            case "mp3":
            case "aac":
            case "wav":
                return (
                    <audio
                        controls
                        src={file.message}
                        style={{
                            width: "100%",
                            height: "85px",
                            paddingBottom: "31px",
                        }}
                    />
                );
            case "txt":
            case "json":
            case "md":
                return (
                    <textarea
                        readOnly
                        value={file.message || "No content available"}
                        style={{
                            width: "100%",
                            height: "300px",
                            border: "none",
                            padding: "8px",
                            background: "#f5f5f5",
                            fontFamily: "monospace",
                        }}
                    />
                );
            case "doc":
            case "docx":
                return (
                    <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.message)}`}
                        style={{
                            width: "100%",
                            height: "250px",
                            border: "none",
                        }}
                        title="Word document preview"
                    />
                );
            case "xls":
            case "xlsx":
                return (
                    <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.message)}`}
                        style={{
                            width: "100%",
                            height: "250px",
                            border: "none",
                        }}
                        title="Excel document preview"
                    />
                );
            default:
                return (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "300px",
                            background: "#f5f5f5",
                            border: "1px solid #ddd",
                            color: "#888",
                        }}
                    >
                        <a
                            href={file.message}
                            download
                            style={{ textDecoration: "none", color: "#007bff" }}
                        >
                            Download {file.message}
                        </a>
                    </div>
                );
        }
    };

    return (
        <ImageListItem
            key={file.name}
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                margin: "auto", // Center the item
                "&:hover": {
                    boxShadow: 8, // Elevation on hover
                },
            }}
        >
            {renderPreview()}
            <ImageListItemBar
                title={file.message_type}
                subtitle={file.message_type || "Unknown"}
                actionIcon={
                    <IconButton
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        aria-label={`info about ${file.message}`}
                    >
                        <InfoIcon />
                    </IconButton>
                }
                sx={{
                    padding: "0px", // Reduce padding for smaller size
                    height: "40px", // Reduce the height of the bottom bar
                }}
            />
        </ImageListItem>
    );
}
