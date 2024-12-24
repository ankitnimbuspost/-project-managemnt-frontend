import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box } from '@mui/material';


export default function DisplayUploadedFiles({ onDataChange, data }) {
    const scrollRef = React.useRef(null);

    // Update state and send it to parent
    const sendDataToParent = (url) => {
        data.forEach((item, key) => {
            if (item.url == url)
                data.splice(key, 1);
        })
        let new_data = data;
        onDataChange([...new_data]); // Pass the state to the parent's callback
    };
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -300, // Adjust the scroll distance as needed
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300, // Adjust the scroll distance as needed
                behavior: 'smooth',
            });
        }
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {/* Left Navigation Button */}
            {data.length > 0 ? <>
                <IconButton
                    onClick={scrollLeft}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: -20,
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        backgroundColor: 'white',
                        border: "1.5px solid #00a15d",
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#b6b6b6',
                        },
                    }}
                    size='small'
                >
                    <ArrowBackIosIcon />
                </IconButton>
            </> : ""}

            {/* Carousel Container */}
            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    gap: 1,
                    py: 1,
                    overflow: 'auto',
                    scrollSnapType: 'x mandatory',
                    '& > *': {
                        scrollSnapAlign: 'center',
                    },
                    '::-webkit-scrollbar': { display: 'none' },

                }}
                style={{ width: '100%' }}
            >
                {data.map((item, index) => (
                    <div className="col-4 file m-0 p-0" key={index}>
                        <div className="row m-0 p-0 pr-1 pt-1">
                            <div className="col-3 m-0 p-0">
                                <div className="round-ext">
                                    <h3>{item.description.charAt(0).toUpperCase() || ''}</h3>
                                </div>
                            </div>
                            <div
                                className="col-9 m-0 p-0"
                                style={{ position: 'relative' }}
                            >
                                <Tooltip title="Delete file">
                                    <CancelIcon className="clear-file" onClick={() => sendDataToParent(item.url)} />
                                </Tooltip>
                                <p className="file-name">
                                    <Tooltip title={item.name}>
                                        <strong>{item.name}</strong>
                                    </Tooltip>
                                </p>
                                <small className="file-name">{item.description} ({item.size} MB)</small>
                            </div>
                        </div>
                    </div>
                ))}
            </Box>

            {/* Right Navigation Button */}
            {data.length > 0 ? <>
                <IconButton
                    onClick={scrollRight}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: -20,
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        backgroundColor: 'white',
                        border: "1.5px solid #00a15d",
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#b6b6b6',
                        },
                    }}
                    size='small'
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </> : ""}
        </Box>
    );
}
