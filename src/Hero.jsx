import { useState } from 'react';
import UserLogin from './UserLogin';
import AdminLogin from './AdminLogin';
import UserSignup from './UserSignup';
import AdminSignup from './AdminSignup';

export default function Hero() {
  const [activeTab, setActiveTab] = useState(null); // null = hero, 'user-login', 'admin-login', 'user-signup', 'admin-signup'
  // helper to switch to login after a duplicate error (if desired) - not used currently
  const goToLogin = (type = 'user-login') => setActiveTab(type);

  if (activeTab === 'user-login') {
    return <UserLogin onBack={() => setActiveTab(null)} />;
  }

  if (activeTab === 'admin-login') {
    return <AdminLogin onBack={() => setActiveTab(null)} />;
  }

  if (activeTab === 'user-signup') {
    return <UserSignup onBack={() => setActiveTab(null)} />;
  }

  if (activeTab === 'admin-signup') {
    return <AdminSignup onBack={() => setActiveTab(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            📝 Your Notes, Your Way
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            A powerful note-taking application with role-based access control
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Whether you're a regular user managing personal notes or an administrator monitoring the system,
            we have you covered with enterprise-grade features and beautiful design.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* User Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary-600 hover:shadow-xl transition">
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Regular User</h2>
            <p className="text-gray-600 mb-6">
              Create, organize, and manage your personal notes with ease. Simple, intuitive, and powerful.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('user-login')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
              >
                🔓 User Login
              </button>
              <button
                onClick={() => setActiveTab('user-signup')}
                className="w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold py-3 px-6 rounded-lg transition"
              >
                📝 Create Account
              </button>
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-admin-600 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Administrator</h2>
            <p className="text-gray-600 mb-6">
              Monitor system activities, manage users, and access comprehensive admin logs and statistics.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('admin-login')}
                className="w-full bg-admin-600 hover:bg-admin-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
              >
                🔐 Admin Login
              </button>
              <button
                onClick={() => setActiveTab('admin-signup')}
                className="w-full border-2 border-admin-600 text-admin-600 hover:bg-admin-50 font-bold py-3 px-6 rounded-lg transition"
              >
                ➕ Register Admin
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">✨ Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* User Features */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-primary-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">📝 Create & Manage Notes</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Create unlimited notes</li>
                <li>✓ Edit anytime</li>
                <li>✓ Organize with search</li>
                <li>✓ Export to JSON</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-primary-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔍 Search & Filter</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Real-time search</li>
                <li>✓ Filter by content</li>
                <li>✓ Quick access</li>
                <li>✓ Organized view</li>
              </ul>
            </div>

            {/* Admin Features */}
            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-admin-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">📊 Admin Logs</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Track all activities</li>
                <li>✓ View statistics</li>
                <li>✓ Filter by action</li>
                <li>✓ Export audit trail</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-admin-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">👥 User Management</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Monitor users</li>
                <li>✓ Track operations</li>
                <li>✓ View timestamps</li>
                <li>✓ System insights</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎨 Beautiful Design</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Modern UI</li>
                <li>✓ Responsive layout</li>
                <li>✓ Smooth animations</li>
                <li>✓ Role-based themes</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔒 Secure Access</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Role-based control</li>
                <li>✓ Separate dashboards</li>
                <li>✓ Permission system</li>
                <li>✓ Audit logging</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">📊 Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-6 text-gray-900 font-bold">Feature</th>
                  <th className="py-4 px-6 text-primary-600 font-bold">👤 User</th>
                  <th className="py-4 px-6 text-admin-600 font-bold">🔐 Admin</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Create Notes', true, true],
                  ['Edit Notes', true, true],
                  ['Delete Notes', true, true],
                  ['Search Notes', true, true],
                  ['Export Notes', true, true],
                  ['View Admin Logs', false, true],
                  ['Monitor Users', false, true],
                  ['Filter Logs', false, true],
                  ['Export Logs', false, true],
                  ['Clear Logs', false, true],
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="text-left py-4 px-6 text-gray-700 font-medium">{row[0]}</td>
                    <td className="py-4 px-6">{row[1] ? '✅' : '❌'}</td>
                    <td className="py-4 px-6">{row[2] ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer: About & Contact (dark) */}
        <footer className="bg-black text-white py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <div id="about" className="rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">About Us</h2>
              <p className="text-gray-300">
                Notes is a simple, secure note-taking application built with a focus on
                usability and role-based access. We provide a lightweight interface for
                personal productivity and admin tools for system monitoring.
              </p>
              <p className="text-gray-400 mt-4">Founded with privacy and simplicity in mind.</p>
            </div>

            <div id="contact" className="rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-gray-300">Questions or support? Reach out to us:</p>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li>
                  <span className="font-semibold">Email:</span>{' '}
                  <a href="mailto:support@notes.app" className="text-primary-400 hover:text-primary-300">support@notes.app</a>
                </li>
                <li>
                  <span className="font-semibold">Phone:</span>{' '}
                  <a href="tel:+15551234" className="text-primary-400 hover:text-primary-300">+1 (555) 123-4</a>
                </li>
                <li>
                  <span className="font-semibold">Address:</span> 123 Notes Lane, Suite 100
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
