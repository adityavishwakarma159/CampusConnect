import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import { announcementService } from '../../services/announcementService';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import { FiUpload, FiX } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const isFaculty = user?.role === 'FACULTY';
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    departmentId: isFaculty ? (user?.departmentId || '') : '',
  });
  const [file, setFile] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch departments for admin users
    if (!isFaculty) {
      fetchDepartments();
    }
    if (isEditMode) {
      fetchAnnouncement();
    }
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const depts = await departmentService.getAllDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchAnnouncement = async () => {
    try {
      const announcement = await announcementService.getAnnouncementById(id);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        departmentId: announcement.departmentId,
      });
      if (announcement.attachmentUrl) {
        setExistingAttachment(announcement.attachmentUrl);
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
      setError('Failed to load announcement');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare request data - convert empty string to null for departmentId
      const requestData = {
        ...formData,
        departmentId: formData.departmentId === '' ? null : Number(formData.departmentId)
      };

      if (isEditMode) {
        // Update announcement
        await announcementService.updateAnnouncement(id, requestData);
        
        // Upload new attachment if provided
        if (file) {
          await announcementService.uploadAttachment(id, file);
        }
      } else {
        // Create announcement
        const announcement = await announcementService.createAnnouncement(requestData);

        // Upload attachment if provided
        if (file) {
          await announcementService.uploadAttachment(announcement.id, file);
        }
      }

      navigate(ROUTES.ANNOUNCEMENTS);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} announcement`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Announcement</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Enter announcement title"
              />
            </div>

            {/* Department */}
            {isFaculty ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <div className="input-field bg-gray-50 text-gray-700">
                  {user?.departmentName || 'Your Department'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Announcements will be posted to your department
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department (Optional)
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field"
                rows="10"
                placeholder="Enter announcement content..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachment (Optional)
              </label>
              
              {/* Show existing attachment in edit mode */}
              {isEditMode && existingAttachment && !file && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiUpload className="text-blue-600 mr-2" />
                      <div>
                        <span className="text-sm text-blue-700 font-medium">Current Attachment</span>
                        <p className="text-xs text-blue-600">{existingAttachment}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExistingAttachment(null)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove attachment"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              )}
              
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-primary-600 hover:text-primary-700 font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, PPT, XLS, or images (max 10MB)
                    {isEditMode && existingAttachment && <span className="block mt-1 text-blue-600">Upload a new file to replace the existing attachment</span>}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FiUpload className="text-primary-600 mr-2" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateAnnouncement;
