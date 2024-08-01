import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { FaInstagram, FaHome } from 'react-icons/fa';

const SuccessDialogComponent = ({ onClose, goToGallery, goToHome }) => {
  const handleInstagramRedirect = () => {
    const instagramUrl = `https://instagram.com/orama_initiative`;
    window.open(instagramUrl, '_blank');
  };

  return (
    <div className="p-6 relative text-center">
      <button
        className="absolute top-2 left-2 p-2"
        onClick={() => {
          onClose();
          goToHome();
        }}
      >
        <FaHome className="w-6 h-6 text-gray-500" />
      </button>
      <div className="flex justify-center mb-4">
        <ConfettiExplosion />
      </div>
      <h3 className="text-2xl font-semibold mb-4">Thank you</h3>
      <p className="mb-6">
        Your contribution is very valuable. You can capture a photo again next time you pass this location or you can see the weekly pictures from this location by clicking{' '}
        <span
          onClick={() => {
            onClose();
            goToGallery();
          }}
          className="text-blue-500 cursor-pointer underline"
        >
          here
        </span>.
      </p>
      <div className="flex justify-center mt-4">
        <button
          className="flex items-center justify-center px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          onClick={handleInstagramRedirect}
        >
          <FaInstagram className="mr-2" size="1.5em" />
          Send us a selfie
        </button>
      </div>
    </div>
  );
};

export default SuccessDialogComponent;
