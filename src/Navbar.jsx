import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();

  if (isLoggedIn()) {
    return (
      <nav className="bg-white shadow-lg border-b-4 border-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">📝 Notes</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                <span className="font-semibold">{user?.username}</span>
                <span className="text-sm text-gray-500"> ({user?.role})</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">📝</span>
            <h1 className="text-2xl font-bold text-primary-600">Notes</h1>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Contact
            </a>
            <div className="border-l border-gray-300 pl-4 flex gap-3">
              <a
                href="#login-user"
                className="text-primary-600 hover:text-primary-700 font-bold transition"
              >
                👤 User Login
              </a>
              <a
                href="#login-admin"
                className="bg-admin-600 hover:bg-admin-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                🔐 Admin Login
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#features" className="block text-gray-700 hover:text-primary-600 py-2 transition">
              Features
            </a>
            <a href="#pricing" className="block text-gray-700 hover:text-primary-600 py-2 transition">
              Pricing
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-primary-600 py-2 transition">
              Contact
            </a>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <a
                href="#login-user"
                className="block text-center text-primary-600 hover:text-primary-700 font-bold py-2 transition"
              >
                👤 User Login
              </a>
              <a
                href="#login-admin"
                className="block text-center bg-admin-600 hover:bg-admin-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                🔐 Admin Login
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
