import type { NodeProps } from "reactflow";

export interface NodeData {
  title: string;
  icon?: string;
  description?: string;
  url?: string;
  to?: string;
  type: number;
  level: number;
  status: number;
  order: number;
  parentId?: string;
  children?: string[];
  displayConfig?: {
    isEnabledOnNonBusinessDay: boolean;
    enabledOnChannels: string[];
  };
  subtitle?: {
    text: string;
  };
  content?: string;
  onUpdate: (id: string, data: Partial<NodeData>) => void;
  onDelete: (id: string) => void;
  onAddChild?: (parentId: string, childId: string) => void;
  onRemoveChild?: (parentId: string, childId: string) => void;
  onSetParent?: (childId: string, parentId: string) => void;
  onEdit?: () => void;
}

export interface CustomNodeProps extends NodeProps {
  data: NodeData;
}

export const NODE_TYPES: Record<1 | 2 | 3 | 4, { color: string; label: string }> = {
  1: { color: "#3b82f6", label: "N1" },
  2: { color: "#10b981", label: "N2" },
  3: { color: "#f59e0b", label: "N3" },
  4: { color: "#ef4444", label: "N4" },
} as const;
