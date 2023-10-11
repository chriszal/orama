import React, { useState } from 'react';
import { Button, DialogContentText } from '@mui/material';

const InstructionsDialog = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div>
      <DialogContentText>
        <div style={{textAlign: 'center', marginBottom: '15px'}}>
          Step: <strong>{step}</strong>/3
        </div>
        {step === 1 && (
          <div>
            <h4>What this project is about</h4>
            <p>Your detailed explanation here...</p>
          </div>
        )}
        {step === 2 && (
          <div>
            <h4>How to Use</h4>
            <p>Step-by-step instructions with illustrations...</p>
          </div>
        )}
        {step === 3 && (
          <div>
            <h4>Data Usage</h4>
            <p>Explanation about how the collected data will be used...</p>
          </div>
        )}
      </DialogContentText>
      <Button onClick={handleNext} color="primary" variant="contained">
        {step < 3 ? 'Next' : 'Finish'}
      </Button>
    </div>
  );
};

export default InstructionsDialog;
