import React from "react";
import { Button, Typography, Box, DialogContent } from "@mui/material";
import SwiperCore, { Pagination } from "swiper"; // Fixed this line
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

// Make sure to call SwiperCore.use() with the Pagination module
SwiperCore.use([Pagination]);

const InstructionsDialog = ({ onClose }) => {
  const steps = [
    { title: "What this project is about", content: "Your detailed explanation here..." },
    { title: "How to Use", content: "Step-by-step instructions with illustrations..." },
    { title: "Data Usage", content: "Explanation about how the collected data will be used..." },
  ];

  const [step, setStep] = React.useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <Box>
        <Swiper
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setStep(swiper.activeIndex)}
          observer={true}
          observeParents={true}
        >

          {steps.map((stepContent, index) => (
            <SwiperSlide key={index}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {stepContent.title}
                </Typography>
                <Typography variant="body1">
                  {stepContent.content}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Button onClick={handleNext} color="primary" variant="contained">
          {step < steps.length - 1 ? "Next" : "Finish"}
        </Button>
      </Box>
    </Box>
  );
};

export default InstructionsDialog;
