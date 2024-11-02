import React from 'react';

const Dialog = ({ title, content, actions }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-4">{content}</div>
        <div className="flex justify-end space-x-2">{actions}</div>
      </div>
    </div>
  );
};

export default Dialog;
