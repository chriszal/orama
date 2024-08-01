import React from 'react';

const CustomAlert = ({ message, type, onClose }) => {
  const alertStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  };

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md ${alertStyles[type]} z-50`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button className="ml-4" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
