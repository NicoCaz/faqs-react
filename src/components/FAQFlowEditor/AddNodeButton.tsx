import React from "react";

interface AddNodeButtonProps {
  onAddNode: () => void;
}

export const AddNodeButton: React.FC<AddNodeButtonProps> = ({ onAddNode }) => {
  return (
    <button
      onClick={onAddNode}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors duration-200"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Agregar nueva FAQ
    </button>
  );
};
