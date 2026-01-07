import { useState } from 'react';
import { authService } from '../../services/authService';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const PasswordReset = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.requestPasswordReset();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit password reset request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password Reset Request
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Request admin approval to reset your password
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Submitted</h3>
              <p className="text-sm text-gray-600">
                Your password reset request has been submitted successfully. 
                An administrator will review your request and send you a reset link via email.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <FiInfo className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Submit a password reset request</li>
                    <li>An administrator will review your request</li>
                    <li>Once approved, you'll receive a reset link via email</li>
                    <li>Use the link to set a new password</li>
                  </ol>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Reset Request'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
