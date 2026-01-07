import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiLock } from 'react-icons/fi';

const GroupChatList = ({ onSelectGroup }) => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState(null);

  const groups = [
    {
      id: 'faculty-student',
      name: 'Faculty-Student Group',
      chatType: 'FACULTY_STUDENT_GROUP',
      description: user?.role === 'FACULTY' || user?.role === 'ADMIN' 
        ? 'Post announcements and messages' 
        : 'Read-only: View faculty messages',
      canPost: user?.role === 'FACULTY' || user?.role === 'ADMIN',
      icon: FiLock,
    },
    {
      id: 'all-students',
      name: 'All Students',
      chatType: 'DEPARTMENT_GROUP',
      description: 'Department-wide student discussions',
      canPost: user?.role === 'STUDENT',
      icon: FiUsers,
    },
  ];

  const handleSelectGroup = (group) => {
    if (!user?.departmentId) {
      alert('Admin users must have a department assigned to use group chat');
      return;
    }
    setSelectedGroup(group.id);
    onSelectGroup(user.departmentId, group.chatType);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Group Chats</h2>
        {user?.departmentId ? (
          <p className="text-sm text-gray-500 mt-1">Department: {user?.departmentName}</p>
        ) : (
          <p className="text-sm text-orange-600 mt-1">⚠️ No department assigned</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!user?.departmentId ? (
          <div className="p-4 text-center text-gray-500">
            <p>Admin users need a department assigned to use group chat</p>
          </div>
        ) : (
          groups.map(group => {
          const Icon = group.icon;
          return (
            <div
              key={group.id}
              onClick={() => handleSelectGroup(group)}
              className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors ${
                selectedGroup === group.id
                  ? 'bg-primary-50 border-2 border-primary-600'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedGroup === group.id ? 'bg-primary-600' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    selectedGroup === group.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    {group.canPost ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Can Post
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Read-only
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
};

export default GroupChatList;
