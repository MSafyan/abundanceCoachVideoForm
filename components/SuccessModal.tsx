import React from "react";
import { X } from "lucide-react";

export const SuccessModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-600">Success!</h2>
        <p className="text-lg mb-4">
          Your video content application has been submitted successfully!
        </p>
        <p className="text-md mb-4">
          You're one step closer to becoming one of our first facilitators.
          We'll review your application and get back to you soon.
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
