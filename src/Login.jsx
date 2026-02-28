import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username or email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      setUsername('');
      setPassword('');
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Notes</h1>
          <p className="text-gray-600">CRUD Application with Admin Logging</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fadeInOut">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username or email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-500 mt-1">Try: admin, john, etc.</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>



          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
          >
            🔓 Sign In
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-4">📋 Demo Access</p>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-semibold text-blue-900">👤 User Access:</p>
              <p className="text-sm text-blue-700 mt-1">
                ✓ Create/Edit/Delete own notes<br/>
                ✓ Search and export notes<br/>
                ✗ Cannot access admin logs
              </p>
            </div>

            <div className="bg-red-50 p-3 rounded-lg">
              <p className="font-semibold text-red-900">🔐 Admin Access:</p>
              <p className="text-sm text-red-700 mt-1">
                ✓ Full CRUD operations<br/>
                ✓ View detailed admin logs<br/>
                ✓ Monitor all activities<br/>
                ✓ Export and clear logs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
