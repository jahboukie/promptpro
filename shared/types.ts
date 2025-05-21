// Shared types between client and server

export interface PromptData {
  title: string;
  content: string;
  model: string;
  goal: string;
  outputFormat: string;
  style: string;
  tone: string;
  actionVerb: string;
  specificDetails: string;
  useRolePlaying: boolean;
  role: string;
}

export interface ApiResponse {
  content: string;
  model: string;
  promptId: number | null;
}

export interface ApiError {
  error: string;
}
