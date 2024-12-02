export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
  chatId: string;
  isEdited?: boolean;
}

export interface Chat {
  id: string;
  firstName: string;
  lastName: string;
  lastMessage?: Message;
  participants: User[];
}

export interface EditChatPayload {
  id: string;
  firstName: string;
  lastName: string;
}