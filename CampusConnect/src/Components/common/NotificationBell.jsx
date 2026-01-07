import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import { FiBell } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const notifications = await notificationService.getRecentNotifications();
      setRecentNotifications(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleBellClick = () => {
    if (!showDropdown) {
      fetchRecentNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        fetchUnreadCount();
        fetchRecentNotifications();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <FiBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <Link
                to={ROUTES.NOTIFICATIONS}
                className="text-sm text-primary-600 hover:text-primary-700"
                onClick={() => setShowDropdown(false)}
              >
                View All
              </Link>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              recentNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
