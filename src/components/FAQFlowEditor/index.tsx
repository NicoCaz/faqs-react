import React, { useCallback, useMemo } from "react";
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

const FAQFlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
      // Procesar el nodo actual
      const newNode = {
        ...node,
        type: "customNode", // Asegurarnos que use el tipo correcto
        position: { x: xOffset, y: yOffset },
        data: {
          ...node.data,
          children: [],
          onUpdate: updateNode,
          onDelete: deleteNode,
          onAddChild: handleAddChild,
          onRemoveChild: handleRemoveChild,
          onSetParent: handleSetParent,
        },
      };
      processedNodes.push(newNode);

      // Procesar los hijos si existen
      if (node.data.children && Array.isArray(node.data.children)) {
        const childrenNodes = node.data.children.filter(
          (child: any) => typeof child === "object"
        );
        xOffset += 300;
        const childrenCount = childrenNodes.length;
        const startY = yOffset - ((childrenCount - 1) * 200) / 2;

        childrenNodes.forEach((childNode: Node, index: number) => {
          yOffset = startY + index * 200;

          // Establecer la relación padre-hijo
          childNode.data = {
            ...childNode.data,
            parentId: node.id,
          };

          processNode(childNode, level + 1);

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

  // Función para agregar un nuevo nodo
  const handleAddNode = useCallback(
    (level: number) => {
      const newNodeId = `node-${Date.now()}`;
      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "customNode",
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        data: {
          title: "Nuevo Nodo",
          type: 0,
          level: level,
          status: 1,
          order: 0,
          children: [],
          onUpdate: updateNode,
          onDelete: deleteNode,
          onAddChild: handleAddChild,
          onRemoveChild: handleRemoveChild,
          onSetParent: handleSetParent,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [
      setNodes,
      updateNode,
      deleteNode,
      handleAddChild,
      handleRemoveChild,
      handleSetParent,
    ]
  );

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

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Barra de herramientas */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Editor de FAQs</h1>
        <div className="flex gap-4 items-center">
          <AddNodeButton onAddNode={handleAddNode} />
          <div className="text-sm text-gray-600">
            Nodos: {nodes.length} | Conexiones: {edges.length}
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
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            snapToGrid={true}
            snapGrid={[15, 15]}
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
    </div>
  );
};

export default FAQFlowEditor;
