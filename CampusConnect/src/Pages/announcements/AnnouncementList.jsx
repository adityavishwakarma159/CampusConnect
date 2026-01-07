import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { announcementService } from '../../services/announcementService';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiCalendar, FiUser, FiBook, FiPaperclip, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ROUTES, ROLES } from '../../utils/constants';

const AnnouncementList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    // Only fetch departments for admin users
    if (user?.role === ROLES.ADMIN) {
      fetchDepartments();
    }
  }, [user]);

  useEffect(() => {
    fetchAnnouncements();
  }, [page, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const depts = await departmentService.getAllDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const deptId = selectedDepartment || (user?.departmentId || null);
      const response = await announcementService.getAllAnnouncements(deptId, page, 10);
      setAnnouncements(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.deleteAnnouncement(id);
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/announcements/${id}/edit`);
  };

  const handleDownloadAttachment = async (id, title) => {
    try {
      const { blob, filename } = await announcementService.downloadAttachment(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `${title}_attachment`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download attachment');
    }
  };

  const canCreateAnnouncement = user?.role === ROLES.ADMIN || user?.role === ROLES.FACULTY;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            {canCreateAnnouncement && (
              <Link to={ROUTES.ANNOUNCEMENTS_CREATE} className="btn-primary">
                <FiPlus className="inline mr-2" />
                Create Announcement
              </Link>
            )}
          </div>

          {/* Filters */}
          {user?.role === ROLES.ADMIN && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="input-field max-w-md"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Announcements List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">No announcements found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map(announcement => (
                <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link to={`/announcements/${announcement.id}`}>
                        <h2 className="text-xl font-bold text-gray-900 hover:text-primary-600 mb-2">
                          {announcement.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiUser className="mr-1" />
                          {announcement.createdByName}
                        </div>
                        <div className="flex items-center">
                          <FiBook className="mr-1" />
                          {announcement.departmentName}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </div>
                        {announcement.attachmentUrl && (
                          <button
                            onClick={() => handleDownloadAttachment(announcement.id, announcement.title)}
                            className="flex items-center text-primary-600 hover:text-primary-800"
                          >
                            <FiPaperclip className="mr-1" />
                            Download Attachment
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {(user?.role === ROLES.ADMIN || announcement.createdById === user?.id) && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(announcement.id)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
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

export default AnnouncementList;
