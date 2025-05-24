import React, { useState, useEffect } from "react";
import { NODE_TYPES } from "./types";

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    url: string;
    level: number;
    order: number;
  }) => void;
  initialData?: {
    title: string;
    description: string;
    url: string;
    level: number;
    order: number;
  };
}

export const NodeModal: React.FC<NodeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [level, setLevel] = useState<number>(1);
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || "");
        setUrl(initialData.url || "");
        setLevel(initialData.level);
        setOrder(initialData.order);
      } else {
        setTitle("");
        setDescription("");
        setUrl("");
        setLevel(1);
        setOrder(0);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, url, level, order });
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setLevel(1);
    setOrder(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Editar FAQ" : "Nueva FAQ"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(NODE_TYPES).map(([lvl, { color, label }]) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(Number(lvl))}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    level === Number(lvl)
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: level === Number(lvl) ? color : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Orden de la FAQ"
              min="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              El orden determina la posición de izquierda a derecha entre FAQs
              del mismo nivel
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título de la FAQ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la FAQ"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="URL de la FAQ"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {initialData ? "Guardar cambios" : "Crear FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
