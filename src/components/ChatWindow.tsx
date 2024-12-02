import React from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import useStore from '../store/useStore';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/chat.module.css';
import { fetchQuote } from '../utils/api';

const ChatWindow: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, chats } = useStore();
  const chatMessages = chatId ? messages[chatId] || [] : [];
  const currentChat = chats.find((c) => c.id === chatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || isLoading) return;

    setIsLoading(true);
    addMessage(chatId, message);
    setMessage('');
    
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const quote = await fetchQuote();
      addMessage(chatId, quote.content, true);
      toast.success('New message received!');
    } catch (error) {
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  if (!chatId || !currentChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className={styles.header}>
        <div className={styles.avatar}>
          <div className={styles.onlineStatus} />
        </div>
        <div className={styles.chatInfo}>
          <h2 className={styles.chatName}>
            {currentChat.firstName} {currentChat.lastName}
          </h2>
          <div className={styles.lastMessage}>Online</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.senderId === 'bot' ? styles.received : styles.sent
            }`}
          >
            <div>{msg.content}</div>
            <div className={styles.messageTime}>
              {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.searchInput}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
export default  ChatWindow;