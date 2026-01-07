import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { userService } from '../../services/userService';
import { FiUpload, FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

const BulkUpload = () => {
  const [userType, setUserType] = useState('STUDENT');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const response = await userService.bulkUploadUsers(file, userType);
      setResult(response);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const downloadStudentTemplate = () => {
    const csvContent = "Name,Email,Roll Number,Department Code,Joining Year\nJohn Doe,john@example.com,CS2024001,CS,2024\nJane Smith,jane@example.com,CS2024002,CS,2024";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadFacultyTemplate = () => {
    const csvContent = "Name,Email,Department Code,Designation\nDr. John Smith,drjohn@example.com,CS,Professor\nDr. Jane Doe,drjane@example.com,CS,Associate Professor";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Bulk User Upload</h1>
            <button
              onClick={() => navigate(ROUTES.ADMIN_USERS)}
              className="btn-secondary"
            >
              Back to Users
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Download the appropriate template below</li>
              <li>Fill in the user details (do not modify column headers)</li>
              <li>Save the file and upload it here</li>
              <li>Review the results and fix any errors if needed</li>
            </ol>
          </div>

          {/* Upload Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="input-field"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                </select>
              </div>

              {/* Template Download */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Download Template
                </label>
                <div className="flex gap-4">
                  <button 
                    onClick={downloadStudentTemplate}
                    className="btn-secondary flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    Student Template
                  </button>
                  <button 
                    onClick={downloadFacultyTemplate}
                    className="btn-secondary flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    Faculty Template
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Student: Name, Email, Roll Number, Department Code, Joining Year<br />
                  Faculty: Name, Email, Department Code, Designation
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File (Excel or CSV)
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                />
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FiUpload className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload Users'}
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Results</h3>
              
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Rows</p>
                  <p className="text-2xl font-bold text-blue-900">{result.totalRows}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Successful</p>
                  <p className="text-2xl font-bold text-green-900">{result.successCount}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Errors</p>
                  <p className="text-2xl font-bold text-red-900">{result.errorCount}</p>
                </div>
              </div>

              {/* Success Message */}
              {result.successCount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start">
                  <FiCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-700">
                      Successfully created {result.successCount} user(s). Invitation emails have been sent.
                    </p>
                  </div>
                </div>
              )}

              {/* Errors */}
              {result.errors && result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <h4 className="font-semibold text-red-900">Errors Found:</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-red-200">
                          <th className="text-left py-2 px-2 text-red-700">Row</th>
                          <th className="text-left py-2 px-2 text-red-700">Field</th>
                          <th className="text-left py-2 px-2 text-red-700">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errors.map((error, idx) => (
                          <tr key={idx} className="border-b border-red-100">
                            <td className="py-2 px-2 text-red-600">{error.row}</td>
                            <td className="py-2 px-2 text-red-600">{error.field}</td>
                            <td className="py-2 px-2 text-red-700">{error.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BulkUpload;
