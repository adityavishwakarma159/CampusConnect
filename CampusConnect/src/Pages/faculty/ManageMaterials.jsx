import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { studyMaterialService } from '../../services/studyMaterialService';
import { FiFileText, FiDownload, FiEdit2, FiTrash2, FiArrowLeft, FiUpload, FiSearch } from 'react-icons/fi';

const ManageMaterials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const materialTypes = [
    { value: 'ALL', label: 'All Types' },
    { value: 'LECTURE_NOTES', label: 'Lecture Notes' },
    { value: 'LAB_MANUAL', label: 'Lab Manual' },
    { value: 'PREVIOUS_PAPERS', label: 'Previous Papers' },
    { value: 'REFERENCE_BOOK', label: 'Reference Book' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [searchTerm, filterType, materials]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await studyMaterialService.getMyMaterials();
      setMaterials(data);
      setFilteredMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
      setMessage({ type: 'info', text: 'No materials found. Upload your first material!' });
      setMaterials([]);
      setFilteredMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    // Filter by type
    if (filterType !== 'ALL') {
      filtered = filtered.filter(m => m.type === filterType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await studyMaterialService.deleteMaterial(id);
      setMessage({ type: 'success', text: 'Material deleted successfully' });
      loadMaterials();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete material' });
    }
  };

  const handleDownload = async (material) => {
    try {
      const blob = await studyMaterialService.downloadMaterial(material.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.fileName || material.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to download material' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link to="/faculty/dashboard" className="text-gray-600 hover:text-gray-900">
                  <FiArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Manage Study Materials</h1>
              </div>
              <Link to="/faculty/materials/upload" className="btn-primary">
                <FiUpload className="inline mr-2" />
                Upload New Material
              </Link>
            </div>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' :
                message.type === 'error' ? 'bg-red-50 text-red-800' :
                'bg-blue-50 text-blue-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, subject, or topic..."
                  className="input-field pl-10"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                {materialTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Materials Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiFileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p>No study materials found</p>
                {materials.length === 0 ? (
                  <Link to="/faculty/materials/upload" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
                    Upload your first material
                  </Link>
                ) : (
                  <p className="text-sm mt-2">Try adjusting your filters</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiFileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{material.title}</div>
                              {material.topic && (
                                <div className="text-xs text-gray-500">{material.topic}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.subject || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {material.type?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDownload(material)}
                              className="text-green-600 hover:text-green-900"
                              title="Download"
                            >
                              <FiDownload className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(material.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {!loading && filteredMaterials.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredMaterials.length} of {materials.length} materials
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageMaterials;
