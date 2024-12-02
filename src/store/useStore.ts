import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat, Message, User, EditChatPayload } from '../types';

interface ChatState {
  currentUser: User | null;
  chats: Chat[];
  messages: Record<string, Message[]>;
  autoMessageEnabled: boolean;
  setCurrentUser: (user: User) => void;
  addMessage: (chatId: string, content: string, isAutoResponse?: boolean) => void;
  deleteChat: (chatId: string) => void;
  createChat: (firstName: string, lastName: string) => void;
  updateChat: (payload: EditChatPayload) => void;
  searchChats: (query: string) => Chat[];
  editMessage: (chatId: string, messageId: string, content: string) => void;
  toggleAutoMessage: () => void;
  initializePredefinedChats: () => void;
}

const PREDEFINED_CHATS = [
  { id: '1', firstName: 'John', lastName: 'Doe' },
  { id: '2', firstName: 'Jane', lastName: 'Smith' },
  { id: '3', firstName: 'Mike', lastName: 'Johnson' },
];

const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      chats: [],
      messages: {},
      autoMessageEnabled: false,

      setCurrentUser: (user) => {
        set({ currentUser: user });
        if (get().chats.length === 0) {
          get().initializePredefinedChats();
        }
      },

      initializePredefinedChats: () => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        set({
          chats: PREDEFINED_CHATS.map((chat) => ({
            ...chat,
            participants: [currentUser],
          })),
        });
      },

      addMessage: (chatId, content, isAutoResponse = false) => {
        const message: Message = {
          id: crypto.randomUUID(),
          content,
          senderId: isAutoResponse ? 'bot' : get().currentUser?.id || '',
          timestamp: Date.now(),
          chatId,
        };
        
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), message],
          },
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, lastMessage: message } : chat
          ),
        }));
      },

      editMessage: (chatId, messageId, content) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId].map((msg) =>
              msg.id === messageId
                ? { ...msg, content, isEdited: true }
                : msg
            ),
          },
        }));
      },

      deleteChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          messages: Object.fromEntries(
            Object.entries(state.messages).filter(([id]) => id !== chatId)
          ),
        })),

      createChat: (firstName, lastName) => {
        const chatId = crypto.randomUUID();
        set((state) => ({
          chats: [
            ...state.chats,
            {
              id: chatId,
              firstName,
              lastName,
              participants: state.currentUser ? [state.currentUser] : [],
            },
          ],
          messages: { ...state.messages, [chatId]: [] },
        }));
      },

      updateChat: ({ id, firstName, lastName }) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === id ? { ...chat, firstName, lastName } : chat
          ),
        }));
      },

      searchChats: (query) => {
        const state = get();
        const lowercaseQuery = query.toLowerCase();
        return state.chats.filter(
          (chat) =>
            chat.firstName.toLowerCase().includes(lowercaseQuery) ||
            chat.lastName.toLowerCase().includes(lowercaseQuery)
        );
      },

      toggleAutoMessage: () => {
        set((state) => ({ autoMessageEnabled: !state.autoMessageEnabled }));
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);

export default useStore;