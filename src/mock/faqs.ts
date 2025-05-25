import type { Node } from "reactflow";
import faqsData from "./faqs.json";

interface FAQNode {
  id: string;
  type: string;
  data: {
    level: number;
    order: number;
    parent?: string;
    [key: string]: any;
  };
}

const calculatePositions = (nodes: FAQNode[]): Node[] => {
  // Crear un mapa de nodos por ID para acceso rápido
  const nodesMap = new Map(nodes.map((node) => [node.id, node]));

  // Agrupar nodos por nivel
  const nodesByLevel = nodes.reduce((acc, node) => {
    const level = node.data.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(node);
    return acc;
  }, {} as Record<number, FAQNode[]>);

  // Ordenar nodos por nivel y orden
  Object.keys(nodesByLevel).forEach((levelStr) => {
    const level = parseInt(levelStr, 10);
    nodesByLevel[level].sort(
      (a: FAQNode, b: FAQNode) => a.data.order - b.data.order
    );
  });

  // Calcular posiciones
  const HORIZONTAL_SPACING = 300; // Espacio entre niveles
  const VERTICAL_SPACING = 150; // Espacio entre nodos del mismo nivel

  // Función para obtener los hijos de un nodo
  const getChildren = (nodeId: string): FAQNode[] => {
    return nodes.filter((node) => node.data.parent === nodeId);
  };

  // Función para calcular la posición Y de un nodo y sus hijos
  const calculateYPosition = (
    node: FAQNode,
    level: number,
    index: number
  ): number => {
    const children = getChildren(node.id);
    if (children.length === 0) {
      return index * VERTICAL_SPACING;
    }

    // Calcular la posición Y promedio de los hijos
    const childrenYPositions = children.map((child, childIndex) =>
      calculateYPosition(child, level + 1, childIndex)
    );
    const averageY =
      childrenYPositions.reduce((sum, y) => sum + y, 0) /
      childrenYPositions.length;

    return averageY;
  };

  // Procesar todos los nodos
  return nodes.map((node) => {
    const level = node.data.level;
    const nodesInLevel = nodesByLevel[level] || [];
    const indexInLevel = nodesInLevel.findIndex(
      (n: FAQNode) => n.id === node.id
    );

    // Calcular posición X basada en el nivel
    const x = level * HORIZONTAL_SPACING;

    // Calcular posición Y basada en el índice y la posición de los hijos
    const y = calculateYPosition(node, level, indexInLevel);

    // Obtener los hijos del nodo
    const children = getChildren(node.id).map((child) => child.id);

    // Crear el nodo con todas sus propiedades
    return {
      id: node.id,
      type: "customNode",
      position: { x, y },
      data: {
        ...node.data,
        children, // Asignar los IDs de los hijos
        parentId: node.data.parent, // Mantener la referencia al padre
        onUpdate: () => {}, // Funciones necesarias para el nodo
        onDelete: () => {},
        onAddChild: () => {},
        onRemoveChild: () => {},
        onSetParent: () => {},
        onEdit: () => {},
      },
    } as Node;
  });
};

// Calcular las posiciones antes de exportar
export const faqs: Node[] = calculatePositions(faqsData.faqs);
