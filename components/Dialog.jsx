import React from 'react';

const Dialog = ({ title, content, actions }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-4">{content}</div>
        <div className="flex justify-end space-x-2">{actions}</div>
      </div>
    </div>
  );
};

export default Dialog;
