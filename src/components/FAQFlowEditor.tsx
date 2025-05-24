import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionMode,
  BackgroundVariant,
  MarkerType,
} from "reactflow";
import type { Node, Edge, NodeProps } from "reactflow";
import type { Connection } from "@reactflow/core";
import "reactflow/dist/style.css";
import { faqs } from "../mock/faqs";

interface NodeData {
  title: string;
  icon?: string;
  description?: string;
  url?: string;
  to?: string;
  type: number;
  level: number;
  status: number;
  order: number;
  displayConfig?: {
    isEnabledOnNonBusinessDay: boolean;
    enabledOnChannels: string[];
  };
  subtitle?: {
    text: string;
  };
  content?: string;
  parent?: string;
  onUpdate: (id: string, data: Partial<NodeData>) => void;
  onDelete: (id: string) => void;
}

interface CustomNodeProps extends NodeProps {
  data: NodeData;
}

// Tipos de nodos disponibles
const NODE_TYPES: Record<1 | 2 | 3 | 4, { color: string; label: string }> = {
  1: { color: "#3b82f6", label: "Nivel 1" },
  2: { color: "#10b981", label: "Nivel 2" },
  3: { color: "#f59e0b", label: "Nivel 3" },
  4: { color: "#ef4444", label: "Nivel 4" },
} as const;

// Componente para nodos personalizados
const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [url, setUrl] = useState(data.url || "");
  const [description, setDescription] = useState(data.description || "");

  const handleSave = () => {
    data.onUpdate(id, { title, url, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(data.title);
    setUrl(data.url || "");
    setDescription(data.description || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 w-64 shadow-lg">
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
      </div>
    );
  }

  const nodeColor =
    NODE_TYPES[data.level as keyof typeof NODE_TYPES]?.color || "#6b7280";
  const nodeLabel =
    NODE_TYPES[data.level as keyof typeof NODE_TYPES]?.label ||
    "Nivel Desconocido";

  return (
    <div
      className="border-2 rounded-lg p-4 w-64 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      style={{
        backgroundColor: `${nodeColor}15`,
        borderColor: nodeColor,
        color: nodeColor,
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
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
          <span className="text-xs font-medium opacity-75">{nodeLabel}</span>
        </div>
        <button
          onClick={() => data.onDelete(id)}
          className="text-gray-500 hover:text-red-500 text-sm font-bold transition-colors duration-200"
        >
          ×
        </button>
      </div>
      <div
        className="font-bold text-base mb-2 border-b pb-2"
        style={{
          borderColor: `${nodeColor}30`,
        }}
      >
        {data.title}
      </div>
      {data.description && (
        <div className="text-xs opacity-80 mb-2">{data.description}</div>
      )}
      {data.url && (
        <div className="text-xs opacity-80 truncate flex items-center gap-1">
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
      {data.displayConfig && (
        <div className="mt-2 text-xs opacity-60">
          <div className="flex items-center gap-1">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {data.displayConfig.isEnabledOnNonBusinessDay
              ? "Habilitado en días no laborables"
              : "Deshabilitado en días no laborables"}
          </div>
          <div className="flex items-center gap-1 mt-1">
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Canales: {data.displayConfig.enabledOnChannels.join(", ")}
          </div>
        </div>
      )}
      <div className="text-xs mt-2 opacity-60 flex items-center gap-1">
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
    </div>
  );
};

// Componente principal
const FAQFlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedConnection, setSelectedConnection] = useState<Edge | null>(
    null
  );

  // Estado del formulario
  const [nodeLevel, setNodeLevel] = useState<keyof typeof NODE_TYPES>(1);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  // Función para actualizar un nodo
  const updateNode = useCallback(
    (nodeId: string, newData: Partial<NodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Función para eliminar un nodo
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  // Función para procesar los nodos y crear las conexiones
  const processNodes = (nodes: Node[]): { nodes: Node[]; edges: Edge[] } => {
    const processedNodes: Node[] = [];
    const edges: Edge[] = [];
    let xOffset = 0;
    let yOffset = 0;

    const processNode = (node: Node, level: number = 0) => {
      const newNode = {
        ...node,
        position: { x: xOffset, y: yOffset },
        data: {
          ...node.data,
          onUpdate: updateNode,
          onDelete: deleteNode,
        },
      };
      processedNodes.push(newNode);

      if (node.data.children) {
        xOffset += 300;
        const childrenCount = node.data.children.length;
        const startY = yOffset - ((childrenCount - 1) * 200) / 2;

        node.data.children.forEach((child: Node, index: number) => {
          yOffset = startY + index * 200;
          processNode(child, level + 1);
          edges.push({
            id: `edge-${node.id}-${child.id}`,
            source: node.id,
            target: child.id,
            type: "smoothstep",
            animated: true,
            style: {
              stroke:
                NODE_TYPES[child.data.level as keyof typeof NODE_TYPES]
                  ?.color || "#6b7280",
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color:
                NODE_TYPES[child.data.level as keyof typeof NODE_TYPES]
                  ?.color || "#6b7280",
            },
          });
        });
        xOffset -= 300;
      }
    };

    nodes.forEach((node) => {
      xOffset = 0;
      yOffset += 300;
      processNode(node);
    });

    return { nodes: processedNodes, edges };
  };

  // Inicializar nodos con las funciones reales
  React.useEffect(() => {
    const { nodes: processedNodes, edges: processedEdges } = processNodes(faqs);
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, []);

  // Handlers del formulario
  const handleSubmit = () => {
    if (title.trim()) {
      createNode({
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        type: 0,
        level: nodeLevel,
        status: 1,
        order: 0,
      });
      setTitle("");
      setUrl("");
      setDescription("");
      setNodeLevel(1);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setNodeLevel(1);
  };

  // Tipos de nodos personalizados
  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    []
  );

  // Función para crear un nuevo nodo
  const createNode = useCallback(
    (nodeData: Omit<NodeData, "onUpdate" | "onDelete">) => {
      const newNode: Node<NodeData> = {
        id: `node-${Date.now()}`,
        type: "customNode",
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: {
          ...nodeData,
          onUpdate: updateNode,
          onDelete: deleteNode,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Manejar conexiones entre nodos
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: params.source,
        target: params.target,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#6b7280",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6b7280",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Manejar clic en edge para editarlo
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedConnection(edge);
  }, []);

  // Función para eliminar conexión
  const deleteConnection = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      setSelectedConnection(null);
    },
    [setEdges]
  );

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Barra de herramientas */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Editor de FAQs</h1>
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-600">
            Nodos: {nodes.length} | Conexiones: {edges.length}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            + Agregar Nodo
          </button>
        </div>
      </div>

      <div
        className="flex h-[calc(100vh-4rem)]"
        style={{ width: "100%", height: "calc(100vh - 4rem)" }}
      >
        {/* Panel izquierdo - Formulario */}
        <div className="w-96 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Crear Nuevo Nodo FAQ</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Nivel del Nodo:
            </label>
            <select
              value={nodeLevel}
              onChange={(e) =>
                setNodeLevel(Number(e.target.value) as keyof typeof NODE_TYPES)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(NODE_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  N{key} - {value.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Título de la FAQ:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="¿Cómo funciona el sistema?"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Descripción:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la FAQ"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              URL (opcional):
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/faq-detalle"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Crear Nodo
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* Área del diagrama */}
        <div className="flex-1" style={{ width: "100%", height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-gray-50"
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { stroke: "#6b7280", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#6b7280",
              },
            }}
            connectionLineStyle={{ stroke: "#6b7280", strokeWidth: 2 }}
            connectionLineComponent={({ fromX, fromY, toX, toY }) => (
              <path
                fill="none"
                stroke="#6b7280"
                strokeWidth={2}
                d={`M${fromX},${fromY} C${fromX + 100},${fromY} ${
                  toX - 100
                },${toY} ${toX},${toY}`}
              />
            )}
          >
            <Controls />
            <MiniMap
              nodeColor={(node) =>
                NODE_TYPES[node.data?.level as keyof typeof NODE_TYPES]
                  ?.color || "#6b7280"
              }
              className="bg-white"
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Panel de información de conexión seleccionada */}
      {selectedConnection && (
        <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500 z-40">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800">
              Conexión Seleccionada
            </h3>
            <button
              onClick={() => setSelectedConnection(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            <div>Origen: {selectedConnection.source}</div>
            <div>Destino: {selectedConnection.target}</div>
          </div>
          <button
            onClick={() => deleteConnection(selectedConnection.id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Eliminar Conexión
          </button>
        </div>
      )}

      {/* Leyenda de tipos de nodos */}
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
          <br />
          • Arrastra entre nodos para conectar
          <br />• Clic en conexión para seleccionar
        </div>
      </div>
    </div>
  );
};

export default FAQFlowEditor;
