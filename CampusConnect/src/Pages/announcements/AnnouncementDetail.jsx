import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { announcementService } from '../../services/announcementService';
import { FiCalendar, FiUser, FiBook, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncementById(id);
      setAnnouncement(data);
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttachment = async () => {
    try {
      const blob = await announcementService.downloadAttachment(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attachment';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download attachment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-12 text-center">
          <p className="text-gray-500">Announcement not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Back Button */}
          <button
            onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
            className="btn-secondary mb-6"
          >
            <FiArrowLeft className="inline mr-2" />
            Back to Announcements
          </button>

          {/* Announcement Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {announcement.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span className="font-medium">Posted by:</span>
                <span className="ml-1">{announcement.createdByName}</span>
              </div>
              <div className="flex items-center">
                <FiBook className="mr-2" />
                <span className="font-medium">Department:</span>
                <span className="ml-1">{announcement.departmentName}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span className="font-medium">Date:</span>
                <span className="ml-1">
                  {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
            </div>

            {/* Attachment */}
            {announcement.attachmentUrl && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiDownload className="text-primary-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Attachment Available</span>
                  </div>
                  <button
                    onClick={handleDownloadAttachment}
                    className="btn-primary"
                  >
                    <FiDownload className="inline mr-2" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnnouncementDetail;
