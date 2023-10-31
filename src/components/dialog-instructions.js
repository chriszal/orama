import React from "react";
import { Button, Typography, Box, SvgIcon } from "@mui/material";
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';

const InstructionsDialog = ({ onClose }) => {
  const steps = [
    { title: "Why You're Here", content: "Every day, every moment, our world changes. From the flow of the tides to the bustling rhythm of city streets, change is the only constant. Now, with the help of your phone and a simple scan, you're about to become a part of a grand project. By capturing a slice of time from this exact spot, you're not just taking a photo – you're adding to a visual timeline, showing how this spot evolves over time." },
    {
      title: "📸 How to Capture",
      content: (
        <>
          1. Tap the <strong>"Take a Photo"</strong> button. 
          <br />
          2. Turn your phone to <strong>landscape mode</strong>. Refer to the image below:
          <br />
          <img src="/assets/instruction-placement.png" alt="Phone in landscape mode" style={{ width: '70%', display: 'block', margin: '8px auto' }} />
          3. Snap, add details, then submit.
        </>
      )
    },
    { title: "Your impact", content: "Each image captured is a brushstroke on a vast canvas. Alone, a picture might seem ordinary, but together, they form a timelapse of life and change. We believe in the power of collective perspective. By gathering images from you and countless others, we're chronicling the world's transformation in real-time. Your contribution not only adds to the beauty of our visual tapestry but also helps researchers, historians, and curious minds to study and appreciate the dynamics of our ever-changing environment. By participating, you're leaving a mark, ensuring this moment is never forgotten." },
  ];

  const [step, setStep] = React.useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const getBackgroundColor = (index) => {
    if (index <= step) {
      return "primary.main";
    } else {
      return "grey.400"; 
    }
  };

  return (
    <Box padding={2} width={400} height={550} display="flex" flexDirection="column" justifyContent="space-between">
      <Box>
        <Typography variant="h5" gutterBottom>
          {steps[step].title}
        </Typography>

        <Box mt={2} display="flex" justifyContent="center" alignItems="center">
          {steps.map((s, index) => (
            <React.Fragment key={index}>
              <Box
                bgcolor={getBackgroundColor(index)}
                width={28}
                height={28}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
              >
                <Typography variant="subtitle1">{index + 1}</Typography>
              </Box>
              {index < steps.length - 1 && (
                <>
                  <Box
                    bgcolor={getBackgroundColor(index + 1)}
                    width={6}
                    height={6}
                    borderRadius="50%"
                    mx={0.5}
                  ></Box>
                  <Box
                    bgcolor={getBackgroundColor(index + 1)}
                    width={6}
                    height={6}
                    borderRadius="50%"
                    mx={0.5}
                  ></Box>
                </>
              )}
            </React.Fragment>
          ))}
        </Box>
        <Typography variant="body2" mt={2}>
          {steps[step].content}
        </Typography>

      </Box>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Button onClick={handleBack} color="primary" variant="contained" disabled={step === 0}>
          Back
        </Button>
        <Button onClick={handleNext} color="primary" variant="contained">
          {step < steps.length - 1 ? "Next" : "Finish"}
        </Button>
      </Box>

    </Box>
  );
};

export default InstructionsDialog;
