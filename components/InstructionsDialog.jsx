import React, { useState, useEffect } from "react";
import { getFirestore, doc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import Lottie from "react-lottie";
import * as animationData from "public/animations/congratulations.json"; // Update the path if necessary
import { FaSpinner, FaArrowLeft } from "react-icons/fa";

const InstructionsDialog = ({ onClose, locationId }) => {
  const [uploadCount, setUploadCount] = useState(null);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [instructionImage, setInstructionImage] = useState("/instruction-placement.png"); // Default image

  const getOrdinalSuffix = (num) => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    if (lastDigit === 1) return "st";
    if (lastDigit === 2) return "nd";
    if (lastDigit === 3) return "rd";
    return "th";
  };

  const steps = [
    {
      title: "🎉 Congratulations! 🎉",
      content: (
        <>
          <div className="flex justify-center mb-4">
            <Lottie options={{ loop: true, autoplay: true, animationData }} height={120} width={120} />
          </div>
          <p className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
            You are the{" "}
            <span className="text-3xl text-blue-600 dark:text-blue-400">
              {isLoading ? (
                <FaSpinner className="animate-spin ml-2 text-lg inline-block" />
              ) : (
                `${uploadCount + 1}${getOrdinalSuffix(uploadCount + 1)}`
              )}
            </span>{" "}
            person uploading at this location!
          </p>
        </>
      ),
    },
    {
      title: "📸 How to Capture 📸",
      content: (
        <div className="text-center text-gray-800 dark:text-gray-200">
          <p>Follow these simple steps:</p>
          <ol className="list-decimal list-inside mt-2 text-left mx-auto w-3/4">
            <li>Tap the <strong>“Take a Photo”</strong> button.</li>
            <li>Turn your phone to <strong>landscape mode</strong> and take a picture of the view as shown below:</li>
          </ol>
          <img src={instructionImage} alt="Phone in landscape mode" className="w-2/3 mx-auto my-4 rounded-lg shadow-md" />
          <p>Then, snap the photo, add details, and submit.</p>
        </div>
      ),
    },
    {
      title: "Why We Collect These Moments",
      content: (
        <p className="text-center text-gray-700 dark:text-gray-300">
          By contributing images, you are helping to chronicle changes over time. Your uploads are valuable for researchers and historians, allowing for a visual tapestry that captures real-time transformations in our world.
        </p>
      ),
    },
  ];

  useEffect(() => {
    const fetchUploadCountAndImage = async () => {
      if (!locationId) return;
      try {
        const db = getFirestore();

        // Fetch upload count
        const locationRef = doc(db, "Locations", locationId);
        const q = query(collection(db, "UserUploads"), where("location_qr_code", "==", locationRef));
        const querySnapshot = await getDocs(q);
        setUploadCount(querySnapshot.size);

        // Fetch the latest approved image
        const approvedQuery = query(
          collection(db, "UserUploads"),
          where("location_qr_code", "==", locationRef),
          where("is_approved", "==", true),
          orderBy("metadata.capture_date_time", "desc"),
          limit(1)
        );
        const approvedSnapshot = await getDocs(approvedQuery);

        const latestImage = approvedSnapshot.docs[0]?.data()?.url || "/instruction-placement.png";
        setInstructionImage(latestImage);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUploadCountAndImage();
  }, [locationId]);

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

  return (
    <div className="p-6 w-full max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-t-lg">
        <div
          className="h-full bg-blue-500 dark:bg-blue-400 rounded-t-lg transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="text-center pt-4">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{steps[step].title}</h3>
        <div className="text-center mb-6">{steps[step].content}</div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-transparent text-blue-500 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
        )}
        <div className={`flex ${step === 0 ? 'justify-center' : 'justify-end'} w-full`}>
          <button
            onClick={handleNext}
            className={`px-4 py-2 rounded ${
              step < steps.length - 1
                ? "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white"
                : "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500 text-white"
            } transition-colors flex items-center justify-center space-x-2`}
            disabled={isLoading}
          >
            {step < steps.length - 1 ? "Next" : "Get Started"}
            {step === 0 && isLoading && (
              <FaSpinner className="animate-spin ml-2 text-lg" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsDialog;
