import React, { useState } from "react";
import { NODE_TYPES } from "./types";

interface AddNodeButtonProps {
  onAddNode: (level: number) => void;
}

export const AddNodeButton: React.FC<AddNodeButtonProps> = ({ onAddNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        Agregar Nodo
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-50">
          <div className="text-sm font-medium text-gray-700 mb-2 px-2">
            Seleccionar nivel
          </div>
          {Object.entries(NODE_TYPES).map(([level, { color, label }]) => (
            <button
              key={level}
              onClick={() => {
                onAddNode(Number(level));
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
