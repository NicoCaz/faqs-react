import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import type { CustomNodeProps } from "./types";
import { NODE_TYPES } from "./types";

const HandleGroup: React.FC<{
  position: Position;
  color: string;
  childrenCount: number;
}> = ({ position, color, childrenCount }) => {
  const isTop = position === Position.Top;
  const width = 200; // Ancho total disponible para los handles
  const handleCount = Math.max(childrenCount + 1, 1); // Siempre al menos 1 handle, y uno más que el número de hijos

  return (
    <div
      className="absolute left-0 right-0 flex justify-between px-8"
      style={{
        top: isTop ? "-8px" : "auto",
        bottom: !isTop ? "-8px" : "auto",
      }}
    >
      {Array.from({ length: handleCount }).map((_, index) => (
        <Handle
          key={`${position}-${index}`}
          type={isTop ? "target" : "source"}
          position={position}
          id={`${position}-${index}`}
          style={{
            background: color,
            width: "12px",
            height: "12px",
            border: "2px solid white",
            transition: "all 0.2s ease",
          }}
          className="hover:scale-125 hover:border-blue-200 cursor-crosshair"
        />
      ))}
    </div>
  );
};

export const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [showRelations, setShowRelations] = useState(false);

  const nodeColor =
    NODE_TYPES[data.level as keyof typeof NODE_TYPES]?.color || "#6b7280";
  const nodeLabel =
    NODE_TYPES[data.level as keyof typeof NODE_TYPES]?.label ||
    "Nivel Desconocido";
  const childrenCount = (data.children || []).length;

  return (
    <div
      className="border-2 rounded-lg p-4 w-64 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative"
      style={{
        backgroundColor: `${nodeColor}15`,
        borderColor: nodeColor,
      }}
    >
      <HandleGroup
        position={Position.Top}
        color={nodeColor}
        childrenCount={childrenCount}
      />

      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{
              backgroundColor: `${nodeColor}30`,
              color: nodeColor,
            }}
          >
            N{data.level}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => data.onDelete(id)}
            className="text-gray-500 hover:text-red-500 text-sm font-bold transition-colors duration-200"
          >
            ×
          </button>
        </div>
      </div>

      <div
        className="font-bold text-lg mb-2 p-2 rounded"
        style={{
          backgroundColor: `${nodeColor}30`,
          color: nodeColor,
        }}
        onDoubleClick={() => data.onEdit?.()}
      >
        {data.title}
      </div>

      {data.description && (
        <div className="text-xs mb-2" style={{ color: nodeColor }}>
          {data.description}
        </div>
      )}

      {data.url && (
        <div
          className="text-xs truncate flex items-center gap-1"
          style={{ color: nodeColor }}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          {data.url}
        </div>
      )}
      <HandleGroup
        position={Position.Bottom}
        color={nodeColor}
        childrenCount={childrenCount}
      />
    </div>
  );
};
