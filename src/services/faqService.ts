import type { Node } from "reactflow";

interface FAQResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const STORAGE_KEY = "faqs-data";

// Function to read the current FAQs
const readFaqs = (): FAQResponse => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      // If no data in localStorage, return empty FAQs
      return {
        success: true,
        data: { faqs: [] },
      };
    }
    const faqs = JSON.parse(storedData);
    return {
      success: true,
      data: faqs,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error reading FAQs",
    };
  }
};

// Function to update FAQs
export const updateFaqs = async (nodes: Node[]): Promise<FAQResponse> => {
  try {
    // Transform nodes to FAQ format
    const updatedFaqs = nodes.map((node) => ({
      id: node.id,
      type: "card",
      data: {
        ...node.data,
        parent: node.data.parentId, // Map parentId to parent for JSON structure
        children: node.data.children || [], // Ensure children array exists
      },
    }));

    // Create new FAQs object
    const newFaqs = {
      faqs: updatedFaqs,
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFaqs));

    return {
      success: true,
      message: "FAQs updated successfully",
      data: newFaqs,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error updating FAQs",
    };
  }
};

// Function to initialize FAQs from the mock data
export const initializeFaqs = (initialData: any): FAQResponse => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return {
      success: true,
      message: "FAQs initialized successfully",
      data: initialData,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error initializing FAQs",
    };
  }
};
