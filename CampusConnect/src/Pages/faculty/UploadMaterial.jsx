import { useState } from 'react';
import Header from '../../components/common/Header';
import { studyMaterialService } from '../../services/studyMaterialService';
import { FiUpload, FiFile } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UploadMaterial = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    topic: '',
    type: 'LECTURE_NOTES'
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const materialTypes = [
    { value: 'LECTURE_NOTES', label: 'Lecture Notes' },
    { value: 'LAB_MANUAL', label: 'Lab Manual' },
    { value: 'PREVIOUS_PAPERS', label: 'Previous Papers' },
    { value: 'REFERENCE_BOOK', label: 'Reference Book' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('subject', formData.subject);
      uploadData.append('topic', formData.topic);
      uploadData.append('type', formData.type);
      uploadData.append('file', file);

      await studyMaterialService.uploadMaterial(uploadData);
      
      setMessage({ type: 'success', text: 'Material uploaded successfully!' });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        topic: '',
        type: 'LECTURE_NOTES'
      });
      setFile(null);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/faculty/materials/manage');
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload material' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Study Material</h1>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures Lecture 1"
                  className="input-field"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the material"
                  rows="3"
                  className="input-field"
                />
              </div>

              {/* Subject and Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Data Structures"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., Arrays"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {materialTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, PPT, PPTX, TXT (max 50MB)
                    </p>
                  </label>
                  
                  {file && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-700">
                      <FiFile className="h-5 w-5" />
                      <span>{file.name}</span>
                      <span className="text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/faculty/materials/manage')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload className="inline mr-2" />
                      Upload Material
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadMaterial;
