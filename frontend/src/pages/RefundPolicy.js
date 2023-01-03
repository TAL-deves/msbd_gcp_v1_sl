import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';

const RefundPolicy = () => {
    return (
        <Container>
            <Box sx={{ m: "3rem",textAlign:"justify" }}>
            <Typography sx={{fontSize:"2rem", fontWeight:"800",textAlign:"center"}}>Cancellation and Refund Policy</Typography>
                <p class="p2">&nbsp;</p>
                <p class="p3"><span class="s1"><strong>Money back / Refund</strong></span></p>
                <p class="p4">&nbsp;</p>
                <p class="p3">If a user is not satisfied with the quality of the course or experience trouble due to technical shortfall from our end, the user may request for a money back or refund.</p>
                <p class="p4">&nbsp;</p>
                <p class="p3"><span class="s1"><strong>Refund Request</strong></span></p>
                <p class="p4">&nbsp;</p>
                <p class="p3">If the user has paid for any course, the user can request for a refund within 24 hours from the payment processing time. To request a refund, the user must follow the step by step instructions given below.</p>
                <p class="p4">&nbsp;</p>
                <ul class="ul1">
                <li class="li3">Send an email to info@techanalyticaltd.com stating the full name and contact number of the user, along with the name of the specific course purchased and explaining the complete reasons for requesting the refund.</li>
                <li class="li3">In your email, you must mention the phone number or email used during registration and the invoice number against the purchase.</li>
                </ul>
                <p class="p4">&nbsp;</p>
                <p class="p3"><span class="s1"><strong>Refund Policy</strong></span></p>
                <p class="p4">&nbsp;</p>
                <ul class="ul1">
                <li class="li3">Refund requests are only valid for registered users</li>
                <li class="li3">Refund request must be made via email with 24 hours from the time of the transaction is made against specific refund request</li>
                <li class="li3">The user must mention the number or email address used for user registration in the refund request email</li>
                <li class="li3">Refund will be made through online financial services or mobile financial services within 7-10 working days after the refund request is accepted and refund is processed by Tech Analytica Limited</li>
                <li class="li3">Upon refund request is accepted, the user shall receive an email as confirmation</li>
                <li class="li3">While processing the refund, any charges imposed by the online or mobile financial service provider will be borne by the user</li>
                <li class="li3">Tech Analytica Limited has the full authority to refuse any refund request if the reason specified against is not legit or bogus</li>
                </ul>
                <p class="p4">&nbsp;</p>
                <p class="p4">&nbsp;</p>
                <p class="p3"><span class="s1"><strong>When a Refund Request is not applicable</strong></span></p>
                <p class="p4">&nbsp;</p>
                <ul class="ul1">
                <li class="li3">If the user has completed more that 1 lesson of the course, the user is no longer eligible for a refund</li>
                <li class="li3">If the user continues the lesson after submitting the refund request, the user is no longer eligible for a refund</li>
                <li class="li3">In case the user purchases a wrong course and continues the course, the user will not get a refund</li>
                <li class="li3">If the user downloads more than one course material, the user will not get a refund</li>
                </ul>
                <p class="p4">&nbsp;</p>
                <p class="p4">&nbsp;</p>
                <p class="p3"><span class="s1"><strong>When a Refund Request is applicable</strong></span></p>
                <p class="p4">&nbsp;</p>
                <ul class="ul1">
                <li class="li3">If the user purchases a wrong course and did not complete any or no more than 1 lesson, the user may ask for a refund</li>
                <li class="li3">If the course materials do not match the mentioned course details</li>
                <li class="li3">If the user mistakenly purchased a live course instead of a recorded course or the other way round</li>
                </ul>
                <p class="p4">&nbsp;</p>
                <p class="p4">&nbsp;</p>
                <p class="p3"><span class="s1"><strong>Refund Process</strong></span></p>
                <p class="p4">&nbsp;</p>
                <ul class="ul1">
                <li class="li3">Once a refund is processed, the specific course against that refund is deleted from the user&rsquo;s profile along with any progress data.</li>
                <li class="li3">Upon completion of the refund process, the user will be notified via a confirmation email/SMS to the registered email address or phone number.</li>
                <li class="li3">After the refund request is approved and processed, if the user do not receive the refund within 7-10 working days, the user must email to info@techanalyticaltd.com and let us know.</li>
                </ul>
                <p class="p4">&nbsp;</p>
                <p class="p3"><span class="s1">Tech Analytica Limited has the complete authority to change or amend the Refund Policy time to time and case by case scenario. </span></p>
                <p class="p4">&nbsp;</p>
            </Box>
        </Container>
    );
};

export default RefundPolicy;