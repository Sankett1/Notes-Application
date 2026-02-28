import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function AdminSignup({ onBack }) {
  const [adminName, setAdminName] = useState('');
  const [adminId, setAdminId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!adminName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!adminId.trim()) {
      setError('Please enter an Admin ID');
      return;
    }

    if (adminId.length < 4) {
      setError('Admin ID must be at least 4 characters');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!department) {
      setError('Please select a department');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setError('Admin password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Demo: create admin account and auto-login
    setSuccess('Admin account created successfully! Logging in...');
    setError('');

    setTimeout(() => {
      login(adminId, 'admin');
      setAdminName('');
      setAdminId('');
      setEmail('');
      setDepartment('');
      setPassword('');
      setConfirmPassword('');
      setSuccess('');
    }, 1500);
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
          <h1 className="text-4xl mb-2">🛡️</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Register Admin</h2>
          <p className="text-gray-600">Create administrator account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fadeInOut">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm animate-fadeInOut">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Administrator"
              value={adminName}
              onChange={(e) => {
                setAdminName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin ID
            </label>
            <input
              type="text"
              placeholder="admin001"
              value={adminId}
              onChange={(e) => {
                setAdminId(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent bg-white transition"
            >
              <option value="">Select department...</option>
              <option value="IT">IT & System Admin</option>
              <option value="Operations">Operations</option>
              <option value="Support">Support</option>
              <option value="Management">Management</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-admin-600 to-admin-700 hover:from-admin-700 hover:to-admin-800 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 mt-2"
          >
            🛡️ Register Admin
          </button>
        </form>

        <div className="mt-6 p-4 bg-admin-50 rounded-lg border border-admin-200">
          <p className="text-xs text-admin-700">
            <strong>Security Requirements:</strong>
            <ul className="mt-2 space-y-1">
              <li>✓ Password: 8+ characters</li>
              <li>✓ Valid corporate email</li>
              <li>✓ Department assignment</li>
              <li>✓ Unique Admin ID</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
