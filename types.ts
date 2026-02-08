
export interface FileStructure {
  path: string;
  description: string;
  isMain?: boolean;
}

export interface GenerationState {
  status: 'idle' | 'architecting' | 'developing' | 'completed' | 'error';
  files: Record<string, string>;
  structure: FileStructure[];
  currentTask: string;
  error?: string;
}

export interface AgentResponse {
  structure?: FileStructure[];
  code?: string;
  fileName?: string;
}
