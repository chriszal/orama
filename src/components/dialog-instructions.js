import React from "react";
import { Button, Typography, Box, DialogContent } from "@mui/material";

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
    <Box padding={2} width={600} height={400} display="flex" flexDirection="column" justifyContent="space-between">
        <Box>
          <Typography variant="h4" gutterBottom>
            {steps[step].title}
          </Typography>
          <Typography variant="body1">
            {steps[step].content}
          </Typography>
        </Box>
      
        <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center">
          <Button onClick={handleNext} color="primary" variant="contained">
            {step < steps.length - 1 ? "Next" : "Finish"}
          </Button>
        </Box>
    </Box>
  );
};

export default InstructionsDialog;
