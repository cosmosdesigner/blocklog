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
}

