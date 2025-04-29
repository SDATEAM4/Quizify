import React from "react";

const NoDataMessage = ({ message }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default NoDataMessage;