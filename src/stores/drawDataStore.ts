import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { BinaryFiles } from "@excalidraw/excalidraw/types";
import { create } from "zustand";
import Dexie, { Table } from "dexie";

// Page data interface
export interface PageData {
  page_id: string; // Primary key
  elements: readonly NonDeletedExcalidrawElement[];
  updatedAt: string; // Timestamp for conflict resolution
  name: string;
  files?: BinaryFiles;
}

// Dexie database class
class DrawDatabase extends Dexie {
  pages!: Table<PageData>;

  constructor() {
    super("DrawDatabase");
    this.version(1).stores({
      pages: "page_id" // page_id as primary key only
    });
  }
}

// Database instance
const db = new DrawDatabase();

// Zustand store type
type DrawDataStore = {
  // Write or update page data (overwrites if updatedAt is newer)
  setPageData: (
    page_id: string,
    elements: readonly NonDeletedExcalidrawElement[],
    updatedAt: string,
    name: string,
    files?: BinaryFiles
  ) => Promise<void>;

  // Read single page data
  getPageData: (page_id: string) => Promise<PageData | undefined>;
};

// Create Zustand store
export const drawDataStore = create<DrawDataStore>()(() => ({
  // Write or update page data
  setPageData: async (page_id, elements, updatedAt, name, files) => {
    try {
      const existingData = await db.pages.get(page_id);
      
      // Save/overwrite if data doesn't exist or updatedAt is newer
      if (!existingData || new Date(updatedAt) > new Date(existingData.updatedAt)) {
        await db.pages.put({
          page_id,
          elements,
          updatedAt,
          name,
          files
        });
      }
    } catch (error) {
      console.error("Failed to set page data:", error);
      throw error;
    }
  },

  // Read single page data
  getPageData: async (page_id) => {
    try {
      return await db.pages.get(page_id);
    } catch (error) {
      console.error("Failed to get page data:", error);
      throw error;
    }
  }
}));


