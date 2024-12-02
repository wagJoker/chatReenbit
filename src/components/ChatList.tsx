import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/chat.module.css';

const ChatList: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { chats, searchChats } = useStore();
  
  const filteredChats = searchQuery ? searchChats(searchQuery) : chats;

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <MessageSquare size={24} />
        </div>
        <h1>Chats</h1>
      </div>
      
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} size={16} />
        <input
          type="text"
          placeholder="Search or start new chat"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.chatList}>
        {filteredChats.map((chat) => (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
            className={styles.chatItem}
          >
            <div className={styles.avatar}>
              <MessageSquare size={20} />
              <div className={styles.onlineStatus} />
            </div>
            <div className={styles.chatInfo}>
              <div className={styles.chatName}>
                {chat.firstName} {chat.lastName}
              </div>
              {chat.lastMessage && (
                <div className={styles.lastMessage}>
                  {chat.lastMessage.content}
                </div>
              )}
            </div>
            {chat.lastMessage && (
              <div className={styles.timestamp}>
                {formatDistanceToNow(chat.lastMessage.timestamp, {
                  addSuffix: true,
                })}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatList;