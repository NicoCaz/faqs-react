import React from "react";
import { NODE_TYPES } from "./types";

export const NodeLegend: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-40">
      <h3 className="font-semibold text-gray-800 mb-2">Tipos de Nodos</h3>
      {Object.entries(NODE_TYPES).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 mb-1">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: value.color }}
          ></div>
          <span className="text-sm">
            N{key} - {value.label}
          </span>
        </div>
      ))}
      <div className="text-xs text-gray-500 mt-2">
        • Doble clic en nodo para editar
        <br />• Arrastra entre nodos para conectar
      </div>
    </div>
  );
};
