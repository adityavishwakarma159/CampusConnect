import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const FirstTimeSetup = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, redirectToDashboard } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authService.firstTimeSetup(newPassword);
      // Redirect to dashboard after successful setup
      redirectToDashboard(user?.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return { label: '', color: '' };
    if (newPassword.length < 8) return { label: 'Too short', color: 'text-red-500' };
    if (newPassword.length < 12) return { label: 'Weak', color: 'text-orange-500' };
    if (newPassword.length < 16) return { label: 'Good', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-green-500' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            First Time Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please set a new password for your account
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter new password"
                />
              </div>
              {newPassword && (
                <p className={`mt-2 text-sm ${strength.color}`}>
                  Password strength: {strength.label}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Confirm new password"
                />
              </div>
              {confirmPassword && newPassword === confirmPassword && (
                <p className="mt-2 text-sm text-green-500 flex items-center">
                  <FiCheckCircle className="mr-1" /> Passwords match
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Password requirements:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Use a mix of letters, numbers, and symbols for better security</li>
                </ul>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting password...' : 'Set Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeSetup;
