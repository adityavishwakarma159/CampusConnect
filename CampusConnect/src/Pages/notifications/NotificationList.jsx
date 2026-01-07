import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { notificationService } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

const NotificationList = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(page, 20);
      setNotifications(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate to referenced content
    if (notification.type === 'ANNOUNCEMENT' && notification.referenceId) {
      navigate(`/announcements/${notification.referenceId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary flex items-center"
            >
              <FiCheckCircle className="mr-2" />
              Mark All as Read
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            notification.type === 'ANNOUNCEMENT' ? 'bg-blue-100 text-blue-800' :
                            notification.type === 'CHAT' ? 'bg-green-100 text-green-800' :
                            notification.type === 'ATTENDANCE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="ml-4 text-primary-600 hover:text-primary-700"
                        title="Mark as read"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="py-2 px-4">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationList;
