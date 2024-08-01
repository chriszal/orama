import React, { useState } from "react";

const InstructionsDialog = ({ onClose }) => {
  const steps = [
    {
      title: "📸 How to Capture",
      content: (
        <>
          1. Tap the <strong>&quot;Take a Photo&quot;</strong> button. 
          <br />
          2. Turn your phone to <strong>landscape mode</strong>. Refer to the image below:
          <br />
          <img src="/instruction-placement.png" alt="Phone in landscape mode" className="w-3/4 mx-auto my-2" />
          3. Snap, add details, then submit.
        </>
      )
    },
    { title: "Why We Collect These Moments", content: "We believe in the power of collective perspective. By gathering images from you and countless others, we're chronicling the world's transformation in real-time. Your contribution not only adds to the beauty of our visual tapestry but also helps researchers, historians, and curious minds to study and appreciate the dynamics of our ever-changing environment. By participating, you're leaving a mark, ensuring this moment is never forgotten." },
  ];

  const [step, setStep] = useState(0);

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
      return "bg-blue-500";
    } else {
      return "bg-gray-400"; 
    }
  };

  return (
    <div className="p-6 w-full max-w-lg flex flex-col justify-between mx-4">
      <div>
        <h3 className="text-xl font-semibold mb-4">{steps[step].title}</h3>

        <div className="flex justify-center items-center mb-4">
          {steps.map((s, index) => (
            <React.Fragment key={index}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${getBackgroundColor(index)}`}>
                <span className="text-sm">{index + 1}</span>
              </div>
              {index < steps.length - 1 && (
                <>
                  <div className={`w-1.5 h-1.5 rounded-full mx-0.5 ${getBackgroundColor(index + 1)}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full mx-0.5 ${getBackgroundColor(index + 1)}`}></div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm">{steps[step].content}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={handleBack} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={step === 0}>
          Back
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {step < steps.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
};

export default InstructionsDialog;
