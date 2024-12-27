import React, { useState, useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export default function ShowChatFiles({ file }) {
    const [parsedData, setParsedData] = useState([]);

    useEffect(() => {
        if (file.message_type === "csv") {
            fetch(file.message)
                .then((response) => response.text())
                .then((csvText) => {
                    const data = Papa.parse(csvText, { header: true });
                    setParsedData(data.data.slice(0, 20)); // Only keep the first 20 rows
                })
                .catch((error) => console.error("Error loading CSV:", error));
        } else if (["xls", "xlsx"].includes(file.message_type)) {
            fetch(file.message)
                .then((response) => response.arrayBuffer())
                .then((buffer) => {
                    const workbook = XLSX.read(buffer, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet);
                    setParsedData(data.slice(0, 20)); // Only keep the first 20 rows
                })
                .catch((error) => console.error("Error loading Excel:", error));
        }
    }, [file.message, file.message_type]);

    const renderTable = () => {
        if (parsedData.length === 0) return <p>No data available</p>;

        return (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {Object.keys(parsedData[0] || {}).map((key) => (
                            <th
                                key={key}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                    background: "#f1f1f1",
                                }}
                            >
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {parsedData.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((cell, idx) => (
                                <td
                                    key={idx}
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                    }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderPreview = () => {
        const fileExtension = file.message_type.toLowerCase();
        const commonStyles = {
            width: "100%",
            border: "none",
        };

        switch (fileExtension) {
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "webp":
                return (
                    <img
                        src={file.message}
                        alt={`${file.message_type} file`}
                        loading="lazy"
                        style={{
                            ...commonStyles,
                            height: "auto",
                            objectFit: "cover",
                            maxHeight: "300px",
                        }}
                    />
                );
            case "pdf":
                return (
                    <iframe
                        src={file.message}
                        title={`${file.message_type} preview`}
                        style={{
                            ...commonStyles,
                            height: "250px",
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
                            ...commonStyles,
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
                            ...commonStyles,
                            height: "300px",
                            padding: "8px",
                            background: "#f5f5f5",
                            fontFamily: "monospace",
                        }}
                    />
                );
            case "doc":
            case "docx":
                return (<></>
                    // <DocViewer
                    //     documents={[{ uri: file.message }]}
                    //     pluginRenderers={DocViewerRenderers}
                    //     style={{
                    //         height: "300px",
                    //         ...commonStyles,
                    //     }}
                    // />
                );
            case "csv":
            case "xls":
            case "xlsx":
                return (
                    <div
                        style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            background: "#f9f9f9",
                            padding: "10px",
                            border: "1px solid #ddd",
                        }}
                    >
                        {parsedData.length > 0 ? (
                            renderTable()
                        ) : (
                            <p>Loading preview...</p>
                        )}
                    </div>
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
                            Download {file.name || "file"}
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
                margin: "auto",
                "&:hover": {
                    boxShadow: 8,
                },
            }}
        >
            {renderPreview()}
            <ImageListItemBar
                title={file.message_type.toUpperCase()}
                subtitle={file.name || "Unknown File"}
                actionIcon={
                    <IconButton
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        aria-label={`info about ${file.message}`}
                    >
                        <InfoIcon />
                    </IconButton>
                }
                sx={{
                    padding: "0px",
                    height: "40px",
                }}
            />
        </ImageListItem>
    );
}
