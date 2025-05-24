import React, { useCallback, useMemo, useState } from "react";
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
import type { Node, Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";
import { faqs } from "../../mock/faqs";
import { CustomNode } from "./CustomNode";
import { NodeLegend } from "./NodeLegend";
import { AddNodeButton } from "./AddNodeButton";
import { NODE_TYPES } from "./types";
import type { NodeData } from "./types";
import { NodeModal } from "./NodeModal";

// Función para actualizar el archivo JSON
const updateFaqsJson = async (nodes: Node[]) => {
  try {
    console.log("Enviando datos a la API:", nodes);
    const response = await fetch('/api/update-faqs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ faqs: nodes }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al guardar los cambios');
    }

    if (!data.success) {
      throw new Error(data.message || 'Error al guardar los cambios');
    }
  } catch (error) {
    console.error('Error al actualizar el archivo JSON:', error);
    alert(`Error al guardar los cambios: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

const FAQFlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    mode: "create" | "edit";
    nodeId?: string;
    initialData?: {
      title: string;
      description: string;
      url: string;
      level: number;
      order: number;
    };
  } | null>(null);

  // Función para agregar un hijo a un nodo
  const handleAddChild = useCallback(
    (parentId: string, childId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              data: {
                ...node.data,
                children: [...(node.data.children || []), childId],
              },
            };
          }
          if (node.id === childId) {
            return {
              ...node,
              data: {
                ...node.data,
                parentId,
              },
            };
          }
          return node;
        })
      );

      // Crear la conexión visual
      const newEdge: Edge = {
        id: `edge-${parentId}-${childId}`,
        source: parentId,
        target: childId,
        type: "smoothstep",
        animated: true,
        style: {
          stroke:
            NODE_TYPES[
              nodes.find((n) => n.id === parentId)?.data
                .level as keyof typeof NODE_TYPES
            ]?.color || "#6b7280",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color:
            NODE_TYPES[
              nodes.find((n) => n.id === parentId)?.data
                .level as keyof typeof NODE_TYPES
            ]?.color || "#6b7280",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setNodes, setEdges, nodes]
  );

  // Función para remover un hijo de un nodo
  const handleRemoveChild = useCallback(
    (parentId: string, childId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              data: {
                ...node.data,
                children: (node.data.children || []).filter(
                  (id) => id !== childId
                ),
              },
            };
          }
          if (node.id === childId) {
            return {
              ...node,
              data: {
                ...node.data,
                parentId: undefined,
              },
            };
          }
          return node;
        })
      );

      // Eliminar la conexión visual
      setEdges((eds) =>
        eds.filter(
          (edge) => !(edge.source === parentId && edge.target === childId)
        )
      );
    },
    [setNodes, setEdges]
  );

  // Función para establecer el padre de un nodo
  const handleSetParent = useCallback(
    (childId: string, parentId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === childId) {
            return {
              ...node,
              data: {
                ...node.data,
                parentId: parentId || undefined,
              },
            };
          }
          return node;
        })
      );

      if (parentId) {
        handleAddChild(parentId, childId);
      }
    },
    [setNodes, handleAddChild]
  );

  // Función para actualizar un nodo
  const updateNode = useCallback(
    async (nodeId: string, newData: Partial<NodeData>) => {
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      );
      setNodes(updatedNodes);
      await updateFaqsJson(updatedNodes);
    },
    [setNodes, nodes]
  );

  // Función para eliminar un nodo
  const deleteNode = useCallback(
    async (nodeId: string) => {
      const updatedNodes = nodes.filter((node) => node.id !== nodeId);
      const updatedEdges = edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      await updateFaqsJson(updatedNodes);
    },
    [setNodes, setEdges, nodes, edges]
  );

  // Función para abrir el modal de edición
  const handleEditNode = useCallback((nodeId: string, data: NodeData) => {
    setModalData({
      mode: "edit",
      nodeId,
      initialData: {
        title: data.title,
        description: data.description || "",
        url: data.url || "",
        level: data.level,
        order: data.order,
      },
    });
    setIsModalOpen(true);
  }, []);

  // Función para abrir el modal de creación
  const handleCreateNode = useCallback(() => {
    setModalData({
      mode: "create",
    });
    setIsModalOpen(true);
  }, []);

  // Función para manejar el guardado del modal
  const handleModalSave = useCallback(
    async (data: {
      title: string;
      description: string;
      url: string;
      level: number;
      order: number;
    }) => {
      if (modalData?.mode === "edit" && modalData.nodeId) {
        const updatedNodes = nodes.map((node) =>
          node.id === modalData.nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              }
            : node
        );
        setNodes(updatedNodes);
        await updateFaqsJson(updatedNodes);
      } else {
        const newNodeId = `node-${Date.now()}`;
        const newNode: Node<NodeData> = {
          id: newNodeId,
          type: "customNode",
          position: {
            x: Math.random() * 500,
            y: Math.random() * 500,
          },
          data: {
            title: data.title,
            description: data.description,
            url: data.url,
            type: 0,
            level: data.level,
            status: 1,
            order: data.order,
            children: [],
            onUpdate: updateNode,
            onDelete: deleteNode,
            onAddChild: handleAddChild,
            onRemoveChild: handleRemoveChild,
            onSetParent: handleSetParent,
          },
        };
        const updatedNodes = [...nodes, newNode];
        setNodes(updatedNodes);
        await updateFaqsJson(updatedNodes);
      }
      setIsModalOpen(false);
      setModalData(null);
    },
    [
      modalData,
      nodes,
      setNodes,
      handleAddChild,
      handleRemoveChild,
      handleSetParent,
      deleteNode,
    ]
  );

  // Función para procesar los nodos y crear las conexiones
  const processNodes = (nodes: Node[]): { nodes: Node[]; edges: Edge[] } => {
    const processedNodes: Node[] = [];
    const edges: Edge[] = [];
    const NODE_WIDTH = 256; // Ancho del nodo (w-64 = 16rem = 256px)
    const NODE_HEIGHT = 200; // Altura aproximada del nodo
    const HORIZONTAL_SPACING = NODE_WIDTH + 100; // Espacio horizontal entre nodos
    const VERTICAL_SPACING = NODE_HEIGHT + 50; // Espacio vertical entre niveles

    // Función para calcular el ancho total de un nodo y sus hijos
    const calculateTreeWidth = (node: Node): number => {
      if (!node.data.children || !Array.isArray(node.data.children)) {
        return NODE_WIDTH;
      }
      const childrenNodes = node.data.children.filter(
        (child: any) => typeof child === "object"
      );
      if (childrenNodes.length === 0) {
        return NODE_WIDTH;
      }
      const childrenWidth = childrenNodes.reduce(
        (total: number, child: Node) => {
          return total + calculateTreeWidth(child);
        },
        0
      );
      return Math.max(
        NODE_WIDTH,
        childrenWidth + (childrenNodes.length - 1) * HORIZONTAL_SPACING
      );
    };

    const processNode = (
      node: Node,
      level: number = 0,
      x: number = 0,
      y: number = 0
    ) => {
      // Procesar el nodo actual
      const newNode = {
        ...node,
        type: "customNode",
        position: { x, y },
        data: {
          ...node.data,
          onUpdate: updateNode,
          onDelete: deleteNode,
          onAddChild: handleAddChild,
          onRemoveChild: handleRemoveChild,
          onSetParent: handleSetParent,
          onEdit: () => handleEditNode(node.id, node.data),
        },
      };
      processedNodes.push(newNode);

      // Procesar los hijos si existen
      if (node.data.children && Array.isArray(node.data.children)) {
        const childrenNodes = node.data.children.filter(
          (child: any) => typeof child === "object"
        );
        const childrenCount = childrenNodes.length;

        if (childrenCount > 0) {
          // Calcular el ancho total de todos los hijos
          const childrenWidth = childrenNodes.reduce(
            (total: number, child: Node) => {
              return total + calculateTreeWidth(child);
            },
            0
          );
          const totalWidth =
            childrenWidth + (childrenCount - 1) * HORIZONTAL_SPACING;

          // Calcular la posición inicial x para centrar los hijos debajo del padre
          const startX = x - totalWidth / 2 + NODE_WIDTH / 2;
          let currentX = startX;

          childrenNodes.forEach((childNode: Node) => {
            // Calcular el ancho del subárbol del hijo
            const childTreeWidth = calculateTreeWidth(childNode);

            // Establecer la relación padre-hijo
            childNode.data = {
              ...childNode.data,
              parentId: node.id,
            };

            // Procesar el hijo recursivamente
            processNode(childNode, level + 1, currentX, y + VERTICAL_SPACING);

            // Crear el edge
            edges.push({
              id: `edge-${node.id}-${childNode.id}`,
              source: node.id,
              target: childNode.id,
              type: "smoothstep",
              animated: true,
              style: {
                stroke:
                  NODE_TYPES[childNode.data.level as keyof typeof NODE_TYPES]
                    ?.color || "#6b7280",
                strokeWidth: 2,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color:
                  NODE_TYPES[childNode.data.level as keyof typeof NODE_TYPES]
                    ?.color || "#6b7280",
              },
            });

            // Actualizar el array de hijos del nodo padre
            const parentNode = processedNodes.find((n) => n.id === node.id);
            if (parentNode) {
              parentNode.data.children = [
                ...(parentNode.data.children || []),
                childNode.id,
              ];
            }

            // Actualizar la posición X para el siguiente hijo
            currentX += childTreeWidth + HORIZONTAL_SPACING;
          });
        }
      }
    };

    // Procesar cada nodo raíz
    const rootNodes = nodes.filter((node) => !node.data.parentId);
    rootNodes.forEach((node) => {
      const treeWidth = calculateTreeWidth(node);
      const startX = (window.innerWidth - treeWidth) / 2;
      processNode(node, 0, startX, 50);
    });

    return { nodes: processedNodes, edges };
  };

  // Inicializar nodos con los datos de faqs.ts
  React.useEffect(() => {
    const { nodes: processedNodes, edges: processedEdges } = processNodes(faqs);
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, []);

  // Tipos de nodos personalizados
  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    []
  );

  // Manejar conexiones entre nodos
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      // Crear la nueva conexión
      const newEdge: Edge = {
        id: `edge-${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: "smoothstep",
        animated: true,
        style: {
          stroke:
            NODE_TYPES[
              nodes.find((n) => n.id === params.source)?.data
                .level as keyof typeof NODE_TYPES
            ]?.color || "#6b7280",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color:
            NODE_TYPES[
              nodes.find((n) => n.id === params.source)?.data
                .level as keyof typeof NODE_TYPES
            ]?.color || "#6b7280",
        },
      };

      // Agregar la conexión
      setEdges((eds) => addEdge(newEdge, eds));

      // Actualizar las relaciones padre-hijo
      handleAddChild(params.source, params.target);
    },
    [setEdges, nodes, handleAddChild]
  );

  // Agregar manejador para eliminar conexión
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const shouldDelete = window.confirm("¿Desea eliminar esta conexión?");
      if (shouldDelete) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        const [sourceId, targetId] = [edge.source, edge.target];
        handleRemoveChild(sourceId, targetId);
      }
    },
    [setEdges, handleRemoveChild]
  );

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Barra de herramientas */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Editor de FAQs</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
              const { nodes: processedNodes, edges: processedEdges } =
                processNodes(nodes);
              setNodes(processedNodes);
              setEdges(processedEdges);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors duration-200"
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
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Reordenar FAQs
          </button>
          <AddNodeButton onAddNode={handleCreateNode} />
          <div className="text-sm text-gray-600">
            FAQs: {nodes.length} | Conexiones: {edges.length}
          </div>
        </div>
      </div>

      <div
        className="flex h-[calc(100vh-4rem)]"
        style={{ width: "100%", height: "calc(100vh - 4rem)" }}
      >
        {/* Área del diagrama */}
        <div className="flex-1" style={{ width: "100%", height: "100%" }}>
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                onEdit: () => handleEditNode(node.id, node.data),
              },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            snapToGrid={true}
            snapGrid={[15, 15]}
            fitView
            minZoom={0.1}
            maxZoom={2}
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
                className="animated"
                d={`M${fromX},${fromY} C${fromX},${fromY + 50} ${toX},${
                  toY - 50
                } ${toX},${toY}`}
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

      <NodeLegend />

      <NodeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalData(null);
        }}
        onSave={handleModalSave}
        initialData={modalData?.initialData}
      />
    </div>
  );
};

export default FAQFlowEditor;
