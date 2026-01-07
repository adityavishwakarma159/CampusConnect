import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import websocketService from '../services/websocketService';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Group chat state
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupPermissions, setGroupPermissions] = useState({});

  useEffect(() => {
    if (user && token) {
      // Connect to WebSocket
      websocketService.connect(token, handleNewMessage, () => {
        loadConversations();
        loadChatUsers();
      });
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user, token]);

  const handleNewMessage = (message) => {
    // Add message to messages if it's for the active chat
    if (activeChat && 
        (message.senderId === activeChat.otherUserId || message.receiverId === activeChat.otherUserId)) {
      setMessages(prev => [...prev, message]);
    }

    // Update conversations
    loadConversations();
  };
  
  const handleGroupMessage = (message) => {
    // Add message to group messages if it's for the active group
    if (activeGroup && message.departmentId === activeGroup.departmentId) {
      setGroupMessages(prev => [...prev, message]);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadChatUsers = async () => {
    try {
      const data = await chatService.getChatUsers();
      setChatUsers(data);
    } catch (error) {
      console.error('Error loading chat users:', error);
    }
  };

  const selectChat = async (otherUser) => {
    setActiveChat(otherUser);
    setLoading(true);

    try {
      const history = await chatService.getMessageHistory(otherUser.id);
      setMessages(history);

      // Mark messages as read
      await chatService.markAsRead(otherUser.id);
      websocketService.markAsRead(otherUser.id);

      // Update conversations
      loadConversations();
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (messageText) => {
    if (!activeChat || !messageText.trim()) return;

    const message = {
      receiverId: activeChat.id,
      message: messageText.trim(),
    };

    websocketService.sendMessage(message);
  };
  
  const selectGroup = async (departmentId, chatType) => {
    setActiveGroup({ departmentId, chatType });
    setActiveChat(null); // Clear direct chat
    setLoading(true);

    try {
      // Load group messages
      const messages = await chatService.getGroupMessages(departmentId, chatType);
      setGroupMessages(messages);

      // Load permissions
      const perms = await chatService.getGroupPermissions(departmentId, chatType);
      setGroupPermissions(perms);

      // Subscribe to group
      websocketService.subscribeToGroupChat(departmentId, handleGroupMessage);
    } catch (error) {
      console.error('Error loading group:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendGroupMessage = (messageText) => {
    if (!activeGroup || !messageText.trim()) return;

    websocketService.sendGroupMessage(
      messageText.trim(),
      activeGroup.departmentId,
      activeGroup.chatType
    );
  };

  const value = {
    conversations,
    activeChat,
    messages,
    chatUsers,
    loading,
    selectChat,
    sendMessage,
    loadConversations,
    // Group chat
    activeGroup,
    groupMessages,
    groupPermissions,
    selectGroup,
    sendGroupMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
