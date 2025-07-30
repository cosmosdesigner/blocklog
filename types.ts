import { Dispatch, SetStateAction } from "react";

export interface Block {
  id: string;
  title: string;
  environment: string;
  problem: string;
  action: string;
  communicationChannel: string;
  created: string; // ISO date string
  createdBy: string;
  resolved: string; // ISO date string, or empty string if not resolved
  tags: Tag[];
}
export interface Tag {
  title: string;
  color: string;
}

export enum BlockStatus {
  ONGOING = "Ongoing",
  RESOLVED = "Resolved",
}

export interface AppContextType {
  blocks: Block[];
  allUniqueTags: Tag[];
  stats: {
    totalBlocks: number;
    ongoingBlocks: number;
    totalBlockedHours: number;
    longestBlock: number;
  };
  isModalOpen: boolean;
  editingBlock: Block | null;
  viewingBlock: Block | null;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleCloseDetailsModal: () => void;
  handleEditBlock: (block: Block) => void;
  handleViewBlockDetails: (block: Block | null) => void;
  setBlocks: Dispatch<SetStateAction<Block[]>>;
  handleSaveBlock: (blockData: Omit<Block, "id" | "resolved">) => void;
  handleResolveBlock: (id: string) => void;
  handleDeleteBlock: (id: string) => void;
}
