import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { FiSend, FiAlertCircle } from 'react-icons/fi';

const GroupChatWindow = () => {
  const { activeGroup, groupMessages, groupPermissions, sendGroupMessage, loading } = useChat();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && groupPermissions.canPost) {
      sendGroupMessage(messageText);
      setMessageText('');
    }
  };

  if (!activeGroup) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p>Select a group to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Group Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="text-lg font-semibold text-gray-900">
          {activeGroup.chatType === 'FACULTY_STUDENT_GROUP' ? 'Faculty-Student Group' : 'All Students'}
        </h3>
        {!groupPermissions.canPost && (
          <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <FiAlertCircle className="h-4 w-4" />
            <span>
              {groupPermissions.facultyMonitoring 
                ? 'Read-only: Faculty is monitoring this group'
                : 'Read-only: Only faculty can post in this group'}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : groupMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No messages yet. Be the first to post!
          </div>
        ) : (
          groupMessages.map((msg, index) => (
            <div key={msg.id || index} className="flex flex-col">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                  {msg.senderName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900">{msg.senderName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mt-1 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <p className="text-gray-900">{msg.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        {groupPermissions.canPost ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 input-field"
            />
            <button type="submit" className="btn-primary" disabled={!messageText.trim()}>
              <FiSend className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-2">
            You cannot post messages in this group
          </div>
        )}
      </form>
    </div>
  );
};

export default GroupChatWindow;
