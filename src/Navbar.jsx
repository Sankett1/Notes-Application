import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  // Hide the navbar entirely when logged in (user or admin)
  if (isLoggedIn()) return null;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📝</span>
            <h1 className="text-2xl font-bold text-primary-600">Notes</h1>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Pricing
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary-600 transition font-medium">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Contact
            </a>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#features" className="block text-gray-700 hover:text-primary-600 py-2 transition">
              Features
            </a>
            <a href="#pricing" className="block text-gray-700 hover:text-primary-600 py-2 transition">
              Pricing
            </a>
            <a href="#about" className="block text-gray-700 hover:text-primary-600 py-2 transition">
              About
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-primary-600 py-2 transition">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
