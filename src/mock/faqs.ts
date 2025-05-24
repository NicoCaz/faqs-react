import type { Node } from "reactflow";
import faqsData from "./faqs.json";

const calculatePositions = (
  nodes: Node[],
  startX: number = 0,
  startY: number = 0,
  level: number = 0
): Node[] => {
  return nodes.map((node, index) => {
    // Ordenar los hijos por order
    const sortedChildren =
      node.data.children?.sort(
        (a: Node, b: Node) => (a.data.order || 0) - (b.data.order || 0)
      ) || [];

    // Calcular la posición del nodo actual
    const x = startX + level * 200; // 200 es el espaciado horizontal entre niveles
    const y = startY + index * 100; // 100 es el espaciado vertical entre nodos del mismo nivel

    // Procesar recursivamente los hijos
    const processedChildren = calculatePositions(
      sortedChildren,
      x,
      y,
      level + 1
    );

    return {
      ...node,
      position: { x, y },
      data: {
        ...node.data,
        children: processedChildren,
      },
    };
  });
};

// Calcular las posiciones antes de exportar
export const faqs: Node[] = calculatePositions(faqsData.faqs);
