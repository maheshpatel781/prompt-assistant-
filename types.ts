export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface GeneratedPromptPart {
  persona: string;
  task: string;
  constraints: string;
  format: string;
  full_text: string;
}

export interface PromptAnalysisResponse {
  analysis: string;
  is_vague: boolean;
  clarification_questions: string[];
  generated_prompt: GeneratedPromptPart;
}

export interface HistoryItem {
  id: string;
  originalInput: string;
  result: PromptAnalysisResponse;
  timestamp: number;
}