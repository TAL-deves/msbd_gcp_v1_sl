import { Button, Container, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'

export default function DataEntry() {
    const [courseID, setCourseID] = useState("")
    const [title, setTitle] = useState("")
    const [introduction, setIntroduction] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [courseLength, setCourseLength] = useState("")
    const [totalLecture, setTotalLecture] = useState("")
    const [price, setPrice] = useState("")
    const [available, setAvailable] = useState("")
    const [instructor, setInstructor] = useState("")
    const [instructorID, setInstructorID] = useState("")
    const [instructorName, setInstructorName] = useState("")
    const [instructorImg, setInstructorImg] = useState("")
    const [instructorDesignation, setInstructorDesignation] = useState("")
    const [instructorDescription, setInstructorDescription] = useState("")
    const [instructorCourses, setInstructorCourses] = useState("")

    return (
        <Container>
        <Box>
            <Typography sx={{textAlign:"center", fontSize:"1.5rem"}}>Submit Information to store in Database</Typography>
                <TextField
                   margin="normal"
                    fullWidth
                    name="profession"
                    label="Profession"
                    id="profession"
                    focused
                    onChange={(e) => { setCourseID(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="profession"
                    label="Title"
                    id="profession"
                    focused
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Introduction"
                    id="introduction"
                    focused
                    onChange={(e) => { setIntroduction(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Thumbnail"
                    id="introduction"
                    focused
                    onChange={(e) => { setThumbnail(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="CourseLength"
                    id="introduction"
                    focused
                    onChange={(e) => { setCourseLength(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="TotalLecture"
                    id="introduction"
                    focused
                    onChange={(e) => { setTotalLecture(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Price"
                    id="introduction"
                    focused
                    onChange={(e) => { setPrice(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Available"
                    id="introduction"
                    focused
                    onChange={(e) => { setAvailable(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Instructor"
                    id="introduction"
                    focused
                    onChange={(e) => { setInstructor(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Instructor ID"
                    id="introduction"
                    focused
                    onChange={(e) => { setInstructorID(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Instructor Name"
                    id="introduction"
                    focused
                    onChange={(e) => { setInstructorName(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Instructor Image Link"
                    id="introduction"
                    focused
                    onChange={(e) => { setInstructorImg(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Instructor Designation"
                    id="introduction"
                    focused
                    onChange={(e) => { setInstructorDesignation(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Instructor Description"
                    id="introduction"
                    focused
                    onChange={(e) => { setInstructorDescription(e.target.value) }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="introduction"
                    label="Instructor Courses"
                    id="introduction"
                    focused
                    onChange={(e) => { setInstructorCourses(e.target.value) }}
                />
                <Button variant='contained'>
                   Submit
                </Button>
        </Box>
        </Container>
    )
}
