export interface Message {
  id: string;
  role: string;
  text: string;
  nextThread?: string[];
}

export interface ThreadMessages {
  id: string;
  messages: Message[];
  isSubmitting: boolean;
  currentThreadOrder: number;
}