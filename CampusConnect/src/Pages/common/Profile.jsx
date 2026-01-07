import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiBriefcase, FiUpload, FiTrash2 } from 'react-icons/fi';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setName(data.name);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateProfile({ name });
      setProfile({ ...profile, name });
      setUser({ ...user, name });
      setEditing(false);
      setMessage({ type: 'success', text: 'Name updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update name' });
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await profileService.uploadProfilePicture(file);
      const newProfilePicture = response.profilePicture;
      setProfile({ ...profile, profilePicture: newProfilePicture });
      setUser({ ...user, profilePicture: newProfilePicture });
      setMessage({ type: 'success', text: 'Profile picture uploaded successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload picture' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!window.confirm('Delete profile picture?')) return;

    try {
      await profileService.deleteProfilePicture();
      setProfile({ ...profile, profilePicture: null });
      setUser({ ...user, profilePicture: null });
      setMessage({ type: 'success', text: 'Profile picture deleted' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete picture' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const pictureUrl = profile?.profilePicture 
    ? profileService.getProfilePictureUrl(profile.profilePicture)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Profile Picture */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                {pictureUrl ? (
                  <img
                    src={pictureUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <FiUser className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <label className="btn-primary cursor-pointer">
                  <FiUpload className="inline mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Picture'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePictureUpload}
                    disabled={uploading}
                  />
                </label>

                {profile?.profilePicture && (
                  <button
                    onClick={handleDeletePicture}
                    className="btn-secondary"
                  >
                    <FiTrash2 className="inline mr-2" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                {editing ? (
                  <form onSubmit={handleUpdateName} className="flex gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field flex-1"
                      required
                    />
                    <button type="submit" className="btn-primary">Save</button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setName(profile.name);
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 dark:text-white">{profile?.name}</p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiMail className="inline mr-2" />
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{profile?.email}</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FiBriefcase className="inline mr-2" />
                  Role
                </label>
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm">
                  {profile?.role}
                </span>
              </div>

              {/* Roll Number (for students) */}
              {profile?.rollNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Roll Number
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.rollNumber}</p>
                </div>
              )}

              {/* Department */}
              {profile?.departmentName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.departmentName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
