import { Block, Tag } from '@/types';

// Backend data types
export interface BackendBlock {
  id: string;
  title: string;
  reason: string;
  status: 'ongoing' | 'resolved';
  startedAt: string;
  resolvedAt: string | null;
  duration: string;
  createdAt: string;
  updatedAt: string;
  tags: BackendTag[];
}

export interface BackendTag {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Convert backend block to frontend block
export const mapBackendBlockToFrontend = (backendBlock: BackendBlock): Block => {
  return {
    id: backendBlock.id,
    title: backendBlock.title,
    environment: 'Production', // Default value since backend doesn't have this
    problem: backendBlock.reason,
    action: '', // Default empty since backend doesn't have this field
    communicationChannel: '', // Default empty since backend doesn't have this field
    created: backendBlock.startedAt,
    createdBy: 'System', // Default value since backend doesn't have this
    resolved: backendBlock.resolvedAt || '',
    tags: backendBlock.tags.map(mapBackendTagToFrontend),
  };
};

// Convert frontend block to backend block
export const mapFrontendBlockToBackend = (frontendBlock: Omit<Block, 'id' | 'resolved'>) => {
  return {
    title: frontendBlock.title,
    reason: frontendBlock.problem,
    // Map tags to tagIds for creation
    tagIds: frontendBlock.tags.map((tag) => tag.title), // We'll need to handle this differently
  };
};

// Convert backend tag to frontend tag
export const mapBackendTagToFrontend = (backendTag: BackendTag): Tag => {
  return {
    title: backendTag.name,
    color: backendTag.color,
  };
};

// Convert frontend tag to backend tag
export const mapFrontendTagToBackend = (frontendTag: Tag) => {
  return {
    name: frontendTag.title,
    color: frontendTag.color,
    description: null,
  };
};

// Helper to convert frontend blocks for API calls
export const prepareBlockForAPI = (blockData: Omit<Block, 'id' | 'resolved'>, existingTags: BackendTag[]) => {
  // Find or create tag IDs
  const tagIds: string[] = [];
  
  for (const frontendTag of blockData.tags) {
    const existingTag = existingTags.find(t => t.name === frontendTag.title);
    if (existingTag) {
      tagIds.push(existingTag.id);
    }
    // If tag doesn't exist, we'll need to create it first
  }
  
  return {
    title: blockData.title,
    reason: blockData.problem,
    tagIds,
  };
};
