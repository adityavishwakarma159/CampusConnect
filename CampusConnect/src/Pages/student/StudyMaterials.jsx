import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { studyMaterialService } from '../../services/studyMaterialService';
import { FiDownload, FiSearch, FiFileText, FiBook, FiFile } from 'react-icons/fi';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    subject: '',
    type: ''
  });

  useEffect(() => {
    loadMaterials();
    loadSubjects();
  }, []);

  useEffect(() => {
    searchMaterials();
  }, [filters]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await studyMaterialService.getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await studyMaterialService.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const searchMaterials = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.subject) params.subject = filters.subject;
      if (filters.type) params.type = filters.type;

      const data = await studyMaterialService.searchMaterials(params);
      setMaterials(data);
    } catch (error) {
      console.error('Error searching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (material) => {
    try {
      const blob = await studyMaterialService.downloadMaterial(material.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.fileName || 'download');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading material:', error);
      alert('Failed to download material');
    }
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'LECTURE_NOTES':
        return FiFileText;
      case 'LAB_MANUAL':
      case 'REFERENCE_BOOK':
        return FiBook;
      default:
        return FiFile;
    }
  };

  const formatType = (type) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Materials</h1>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    placeholder="Search materials..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="LECTURE_NOTES">Lecture Notes</option>
                  <option value="LAB_MANUAL">Lab Manual</option>
                  <option value="PREVIOUS_PAPERS">Previous Papers</option>
                  <option value="REFERENCE_BOOK">Reference Book</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Materials Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : materials.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              <FiFile className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>No study materials found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(material => {
                const Icon = getMaterialIcon(material.type);
                return (
                  <div key={material.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{material.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {material.subject}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {formatType(material.type)}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 mb-3">
                          <p>Uploaded by: {material.uploadedByName}</p>
                          <p>Size: {formatFileSize(material.fileSize)}</p>
                          <p>Downloads: {material.downloadCount}</p>
                        </div>

                        <button
                          onClick={() => handleDownload(material)}
                          className="btn-primary w-full text-sm"
                        >
                          <FiDownload className="inline mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudyMaterials;
