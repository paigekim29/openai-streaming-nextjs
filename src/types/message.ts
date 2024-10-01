export interface Message {
  id: string;
  role: string;
  text: string;
}

export interface ThreadMessages {
  id: string;
  messages: Message[];
  isSubmitting: boolean;
}