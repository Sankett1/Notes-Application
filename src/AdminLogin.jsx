import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function AdminLogin({ onBack }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!adminId.trim()) {
      setError('Please enter your Admin ID');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Demo admin credentials
    const validAdmins = {
      'admin001': 'admin@123',
      'admin': 'admin123',
      'superadmin': 'super@2024'
    };

    if (adminId in validAdmins && validAdmins[adminId] === password) {
      login(adminId, 'admin');
      setAdminId('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid Admin ID or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border-t-4 border-admin-600">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-2xl mb-6 transition"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">🔐</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">Admin-only access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fadeInOut">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin ID
            </label>
            <input
              type="text"
              placeholder="Enter Admin ID"
              value={adminId}
              onChange={(e) => {
                setAdminId(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-500 mt-1">Try: admin, admin001, or superadmin</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-admin-600 to-admin-700 hover:from-admin-700 hover:to-admin-800 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
          >
            🔓 Admin Login
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">Demo Credentials</p>
          <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div>
              <strong>Admin ID:</strong> admin<br/>
              <strong>Password:</strong> admin123
            </div>
            <div className="border-t pt-2">
              <strong>Admin ID:</strong> admin001<br/>
              <strong>Password:</strong> admin@123
            </div>
            <div className="border-t pt-2">
              <strong>Admin ID:</strong> superadmin<br/>
              <strong>Password:</strong> super@2024
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-admin-50 rounded-lg border border-admin-200">
          <p className="text-xs text-admin-700">
            <strong>⚠️ Important:</strong> This is an admin-only area. Only authorized administrators should log in here.
          </p>
        </div>
      </div>
    </div>
  );
}
