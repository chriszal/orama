import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { FaInstagram, FaHome } from 'react-icons/fa';

const SuccessDialogComponent = ({ onClose, goToGallery, goToHome }) => {
  const handleInstagramRedirect = () => {
    const instagramUrl = `https://instagram.com/orama_initiative`;
    window.open(instagramUrl, '_blank');
  };

  return (
    <div className="relative p-8 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 text-center overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white animate-bounceIn">Thank You!</h3>
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
          onClick={() => {
            onClose();
            goToHome();
          }}
        >
          <FaHome className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="relative mb-8">
        <ConfettiExplosion
          force={0.6}
          duration={3000}
          particleCount={100}
          colors={['#FF5A5F', '#FFD700', '#FF69B4']}
          width={350}
        />
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
        Your contribution is valuable! Feel free to capture another moment next time you pass by. You can also view all the other photos on this location by clicking{' '}
        <span
          onClick={() => {
            onClose();
            goToGallery();
          }}
          className="text-blue-500 dark:text-blue-400 cursor-pointer underline font-semibold"
        >
          here
        </span>.
      </p>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handleInstagramRedirect}
          className="flex items-center justify-center px-5 py-2 bg-pink-500 text-white rounded-full shadow-lg transform transition-all hover:bg-pink-600 hover:scale-105"
        >
          <FaInstagram className="mr-2" size="1.5em" />
          Send us feedback
        </button>
      </div>
    </div>
  );
};

export default SuccessDialogComponent;
