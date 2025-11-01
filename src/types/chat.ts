export interface Message {
  id: string;
  type: 'human' | 'ai';
  content: string;
  created_at: string;
}

export interface MessageRow {
  id: string;
  session_id: string;
  message: Message;
  created_at: string;
}

export interface AgentRequest {
  query: string;
  user_id: string;
  request_id: string;
  session_id: string;
}

export interface Conversation {
  session_id: string;
  title: string;
  created_at: string;
}
