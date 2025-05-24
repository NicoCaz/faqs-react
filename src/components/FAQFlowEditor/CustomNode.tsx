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
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || "Nuevo Nodo");
  const [url, setUrl] = useState(data.url || "");
  const [description, setDescription] = useState(data.description || "");
  const [showRelations, setShowRelations] = useState(false);

  const nodeColor =
    NODE_TYPES[data.level as keyof typeof NODE_TYPES]?.color || "#6b7280";
  const nodeLabel =
    NODE_TYPES[data.level as keyof typeof NODE_TYPES]?.label ||
    "Nivel Desconocido";
  const childrenCount = (data.children || []).length;

  const handleSave = () => {
    data.onUpdate(id, { title, url, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(data.title || "");
    setUrl(data.url || "");
    setDescription(data.description || "");
    setIsEditing(false);
  };

  const handleRemoveChild = (childId: string) => {
    if (data.onRemoveChild) {
      data.onRemoveChild(id, childId);
    }
  };

  const handleSetParent = (parentId: string) => {
    if (data.onSetParent) {
      data.onSetParent(id, parentId);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 w-64 shadow-lg relative">
        <HandleGroup
          position={Position.Top}
          color={nodeColor}
          childrenCount={childrenCount}
        />

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Título de la FAQ"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="https://ejemplo.com/faq"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Descripción de la FAQ"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>

        <HandleGroup
          position={Position.Bottom}
          color={nodeColor}
          childrenCount={childrenCount}
        />
      </div>
    );
  }

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
          <span className="text-xs font-medium" style={{ color: nodeColor }}>
            {nodeLabel}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowRelations(!showRelations)}
            className="text-gray-500 hover:text-blue-500 text-sm font-bold transition-colors duration-200"
          >
            {showRelations ? "▼" : "▶"}
          </button>
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
        onDoubleClick={() => setIsEditing(true)}
      >
        {title}
      </div>

      {description && (
        <div className="text-xs mb-2" style={{ color: nodeColor }}>
          {description}
        </div>
      )}

      {url && (
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
          {url}
        </div>
      )}

      {showRelations && (
        <div
          className="mt-2 pt-2 border-t"
          style={{ borderColor: `${nodeColor}30` }}
        >
          <div
            className="text-xs font-medium mb-1"
            style={{ color: nodeColor }}
          >
            Relaciones:
          </div>
          <div className="space-y-1">
            {data.parentId && (
              <div
                className="text-xs flex items-center gap-1"
                style={{ color: nodeColor }}
              >
                <span className="opacity-60">Padre:</span>
                <span>{data.parentId}</span>
                <button
                  onClick={() => handleSetParent("")}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            )}
            {data.children && data.children.length > 0 && (
              <div className="text-xs" style={{ color: nodeColor }}>
                <span className="opacity-60">Hijos:</span>
                {data.children.map((childId) => (
                  <div key={childId} className="flex items-center gap-1 ml-2">
                    <span>{childId}</span>
                    <button
                      onClick={() => handleRemoveChild(childId)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="text-xs mt-2 opacity-60 flex items-center gap-1"
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
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Doble clic para editar
      </div>

      <HandleGroup
        position={Position.Bottom}
        color={nodeColor}
        childrenCount={childrenCount}
      />
    </div>
  );
};
