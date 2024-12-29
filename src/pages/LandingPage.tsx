import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Pill, ShieldCheck, Stethoscope, Sparkles, Users, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Pill className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">PharmaPro</span>
          </div>
          <div className="space-x-4 flex items-center">
            <a href="#product" className="hidden md:inline-block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Product
            </a>
            <a href="#pricing" className="hidden md:inline-block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Pricing
            </a>
            <a href="#about" className="hidden md:inline-block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              About Us
            </a>
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Empowering Healthcare,
            <br />
            One Pharmacy at a Time
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Modern pharmacy management solution designed for Spanish pharmacies.
            Streamline operations, enhance patient care, and grow your business.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16" id="features">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <ShieldCheck className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Secure & Compliant</h3>
              <p className="text-gray-600 dark:text-gray-300">GDPR compliant with enterprise-grade security</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <Stethoscope className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Patient-Centric</h3>
              <p className="text-gray-600 dark:text-gray-300">Enhanced patient care and management</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <Pill className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Inventory Control</h3>
              <p className="text-gray-600 dark:text-gray-300">Smart inventory management with AI insights</p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why Choose PharmaPro?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-600 dark:text-gray-300">Smart inventory predictions and customer recommendations</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Patient-Centric</h3>
                  <p className="text-gray-600 dark:text-gray-300">Comprehensive patient profiles and history tracking</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Business Growth</h3>
                  <p className="text-gray-600 dark:text-gray-300">Tools and insights to expand your pharmacy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16" id="testimonials">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Trusted by Pharmacies</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Maria Garcia"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Maria Garcia</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Farmacia Garcia, Barcelona</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">"PharmaPro has transformed how we manage our pharmacy. The AI-powered inventory management alone has saved us countless hours."</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Carlos Rodriguez"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Carlos Rodriguez</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Farmacia Central, Madrid</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">"The customer management features have helped us provide better, more personalized care to our patients. Highly recommended!"</p>
              </div>
            </div>
          </div>

          <Link
            to="/register"
            className="px-8 py-4 text-lg rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Start Your Free Trial
          </Link>
        </div>
      </main>
    </div>
  );
}