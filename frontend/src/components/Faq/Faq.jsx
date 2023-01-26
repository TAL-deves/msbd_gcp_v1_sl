import { Accordion, AccordionDetails, AccordionSummary, Container, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'
import Lottie from "lottie-react";
import faqAnimation from "./support.json";
import faqAnimation_dark from "./support_dark.json";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from 'react';
import api from "../../api/Axios"
import { globalContext } from '../../pages/GlobalContext';

const FAQ_URL = "/api/faq";

export default function Faq() {
    const { language } = useContext(globalContext);
    const [expanded, setExpanded] = React.useState(false);
    const [faq, setFaq] = React.useState([])

    const username = localStorage.getItem("user")

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const style = {
        height: "80%",
        width: "80%",
        marginLeft: "3rem",

    };

    let fetchFaq = async () => {
        const response = await api
            .post(FAQ_URL, JSON.stringify({ language }), {
                headers: { "Content-Type": "application/json" },
                "Access-Control-Allow-Credentials": true,
            })
            .then((data) => {
                setFaq(data.data.data)
            });

        //// console.log("response", response);
    };

    useEffect(() => {
        fetchFaq()
    },[language])
    return (
        <Box sx={{ margin: "5%" }}>
            <Container>
                <Typography sx={{ textAlign: "center", fontSize: "2rem", color: "primary.main" }}>FAQ-Frequently Asked Question</Typography>
                <Grid container sx={{ display: "flex", alignItems: "center" }}>
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>

                        {faq.map((faq) => {
                            return (
                                <Accordion expanded={expanded === `${faq._id}`} onChange={handleChange(`${faq._id}`)
                            }>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography sx={{ width: '70%', flexShrink: 0 }}>
                                            {faq.question}
                                        </Typography>
                                        {/* <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    {faq.question}
                                </Typography> */}

                                    </AccordionSummary>
                                    <AccordionDetails sx={{ backgroundColor: "#e0e0e0" }}>
                                        <Typography>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>

                                    {/* <AccordionDetails>
                                <Typography>
                                {faq.answer}
                                </Typography>
                            </AccordionDetails> */}
                                </Accordion>
                            )
                        })}
                    </Grid>
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Box>
                            {localStorage.getItem("theme") === "darkTheme" ?
                                <Lottie
                                    animationData={faqAnimation}
                                    style={style}
                                />
                                :
                                <Lottie
                                    animationData={faqAnimation_dark}
                                    style={style}
                                />

                            }
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
