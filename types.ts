
export enum BlockStatus {
  ONGOING = 'Ongoing',
  RESOLVED = 'Resolved',
}

export interface Block {
  id: string;
  title: string;
  reason: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  status: BlockStatus;
}
