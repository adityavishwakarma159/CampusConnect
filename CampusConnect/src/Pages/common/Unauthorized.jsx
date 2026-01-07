import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <FiAlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <Link to={ROUTES.LOGIN} className="btn-primary inline-block">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
