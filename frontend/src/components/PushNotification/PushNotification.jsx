import { Button, MenuItem, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React from 'react'
import { useState } from 'react'
import swal from 'sweetalert'
import api from '../../api/Axios'

const PUSH_NOTIFICATION_URL = "/api/pushnotification"


const Priorities = [
    {
        value: 'high',
        label: 'High',
    },
    {
        value: 'medium',
        label: 'Medium',
    },
    {
        value: 'low',
        label: 'Low',
    }
];
const toList = [
    {
        value: 'none',
        label: 'None',
    },
    {
        value: '/topics/all',
        label: 'All',
    },
    {
        value: 'web',
        label: 'web',
    },
    
];
export default function PushNotification() {

    const [title, setTitle] = useState()
    const [body, setBody] = useState()
    const [dataBody, setDataBody] = useState()
    const [dataTitle, setDataTitle] = useState()
    const [imageLink, setImageLink] = useState()
    const [dataImageLink, setDataImageLink] = useState()
    const [videoLink, setVideoLink] = useState()
    const [file, setFile] =useState()
    const [target, setTarget] =useState()
    const [dataVideoLink, setDataVideoLink] = useState()
    const [priority, setPriority] = useState("high")
    const [to, setTo] = useState("none")
    let username = localStorage.getItem('user')

    // let handlePushNotification = async () => {
    //     const response = await api.post(PUSH_NOTIFICATION_URL,
    //         JSON.stringify({ username, title, body, dataBody, dataTitle, imageLink, dataImageLink, videoLink, dataVideoLink, priority,to }),
    //         {
    //             headers: { 'Content-Type': 'application/json' },
    //             'Access-Control-Allow-Credentials': true
    //         }
    //     )
    //     console.log(username, title, body, dataBody, dataTitle, imageLink, dataImageLink, videoLink, dataVideoLink, priority,to)
    // }

    let handlePushNotification = async () => {
        await api.post(PUSH_NOTIFICATION_URL, JSON.stringify({ username, title, body, dataBody, dataTitle, imageLink, dataImageLink, videoLink, dataVideoLink, priority, to, file, target }), {
            headers: { "Content-Type": "application/json" },
            "Access-Control-Allow-Credentials": true,
        })
            .then((data) => {
                if (data.data.result.status === 200) {
                    swal("Success", "Push Notification Sent", "success")
                }
                else {
                    swal("failed", "Failed to send notification", "error")
                }
            });

    };

    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: "600", textAlign: "center" }}>Insert Information for Push Notification</Typography>
            <Box sx={{ paddingLeft: "5rem", paddingRight: "5rem" }}>

                <Typography sx={{fontSize:"1.5rem", fontWeight:"800", textAlign:"center"}}>Notification Tray</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Title"
                    id="introduction"
                    focused
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Body"
                    id="introduction"
                    focused
                    onChange={(e) => { setBody(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Image Link"
                    id="introduction"
                    focused
                    onChange={(e) => { setImageLink(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Video Link"
                    id="introduction"
                    focused
                    onChange={(e) => { setVideoLink(e.target.value) }}
                />
                <Typography sx={{fontSize:"1.5rem", fontWeight:"800", textAlign:"center"}}>App Popup</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Data Title"
                    id="introduction"
                    focused
                    onChange={(e) => { setDataTitle(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Data Body"
                    id="introduction"
                    focused
                    onChange={(e) => { setDataBody(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Data Image Link"
                    id="introduction"
                    focused
                    onChange={(e) => { setDataImageLink(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Data Video Link"
                    id="introduction"
                    focused
                    onChange={(e) => { setDataVideoLink(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="File"
                    id="introduction"
                    focused
                    onChange={(e) => { setFile(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Target"
                    id="introduction"
                    focused
                    onChange={(e) => { setTarget(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="outlined-select-currency"
                    select
                    focused
                    label="Priority"
                    value={priority}
                    onChange={(e) => {
                        setPriority(e.target.value)
                    }}
                >
                    {Priorities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <br />
                <TextField
                    fullWidth
                    margin="normal"
                    id="outlined-select-currency"
                    select
                    focused
                    label="To Address"
                    value={to}
                    onChange={(e) => {
                        setTo(e.target.value)
                    }}
                >
                    {toList.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

            </Box>
            <Button onClick={handlePushNotification} variant='contained'>
                Send Notification
            </Button>
        </Container>
    )
}
