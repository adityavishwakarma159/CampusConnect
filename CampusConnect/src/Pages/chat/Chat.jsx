import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useChat } from '../../context/ChatContext';
import GroupChatList from '../../components/chat/GroupChatList';
import GroupChatWindow from '../../components/chat/GroupChatWindow';
import { FiSend, FiMessageSquare, FiUsers } from 'react-icons/fi';

const Chat = () => {
  const { conversations, activeChat, messages, chatUsers, loading, selectChat, sendMessage, selectGroup } = useChat();
  const [messageText, setMessageText] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'groups'
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle auto-selection of chat from URL params
  useEffect(() => {
    if (userIdParam && chatUsers.length > 0) {
      const targetId = parseInt(userIdParam);
      // Switch if no active chat or if active chat is different from requested user
      if (!activeChat || activeChat.id !== targetId) {
        const targetUser = chatUsers.find(u => u.id === targetId);
        if (targetUser) {
          selectChat(targetUser);
        }
      }
    }
  }, [userIdParam, chatUsers, activeChat, selectChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  const handleSelectUser = (user) => {
    selectChat(user);
    setShowUserList(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tabs */}
          <div className="bg-white rounded-t-lg shadow-md border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('direct')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'direct'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiMessageSquare className="h-5 w-5" />
                  <span>Direct Messages</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'groups'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiUsers className="h-5 w-5" />
                  <span>Groups</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-lg shadow-md h-[calc(100vh-250px)] flex">
            {activeTab === 'direct' ? (
              <>
                {/* Conversation List */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                    <button
                      onClick={() => setShowUserList(!showUserList)}
                      className="mt-2 btn-primary w-full"
                    >
                      <FiMessageSquare className="inline mr-2" />
                      New Chat
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {showUserList ? (
                      <div className="p-2">
                        <h3 className="text-sm font-semibold text-gray-700 px-2 mb-2">Select User</h3>
                        {chatUsers.map(user => (
                          <div
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="p-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                          >
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                          </div>
                        ))}
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No conversations yet
                      </div>
                    ) : (
                      conversations.map(conv => (
                        <div
                          key={conv.id}
                          onClick={() => selectChat({ id: conv.otherUserId, name: conv.otherUserName })}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            activeChat?.id === conv.otherUserId ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{conv.otherUserName}</p>
                              <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col">
                  {activeChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{activeChat.name}</h3>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            No messages yet. Start the conversation!
                          </div>
                        ) : (
                          messages.map((msg, index) => {
                            const isOwn = msg.senderId !== activeChat.id;
                            return (
                              <div
                                key={msg.id || index}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    isOwn
                                      ? 'bg-primary-600 text-white'
                                      : 'bg-gray-200 text-gray-900'
                                  }`}
                                >
                                  <p>{msg.message}</p>
                                  <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 input-field"
                          />
                          <button type="submit" className="btn-primary">
                            <FiSend className="h-5 w-5" />
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <FiMessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p>Select a conversation to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Group Chat List */}
                <div className="w-1/3 border-r border-gray-200">
                  <GroupChatList onSelectGroup={selectGroup} />
                </div>

                {/* Group Chat Window */}
                <GroupChatWindow />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
