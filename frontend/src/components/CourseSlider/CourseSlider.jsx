import { Box } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react'
import Slider from "react-slick";
import CourseCard from '../CourseCard/CourseCard';

const CourseSlider = () => {

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        gap:2,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
  

  return (
    <Box>
        <Container>

    <Slider {...settings}>
      <CourseCard sx={{marginLeft:"5px"}}></CourseCard>
      <CourseCard sx={{marginLeft:"5px"}}></CourseCard>
      <CourseCard sx={{marginLeft:"5px"}}></CourseCard>
      <CourseCard sx={{marginLeft:"5px"}}></CourseCard>
      <CourseCard sx={{marginLeft:"5px"}}></CourseCard>
      <CourseCard sx={{marginLeft:"5px"}}></CourseCard>
    </Slider>
        </Container>
    </Box>
  )
}

export default CourseSlider