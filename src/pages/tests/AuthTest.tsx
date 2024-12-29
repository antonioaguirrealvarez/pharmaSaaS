import React, { useState } from 'react';
import { apiClient } from '../../lib/api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      const { data, error } = await apiClient.getSupabase().auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/tests/auth`
        }
      });
      setOutput(JSON.stringify({ data, error }, null, 2));
    } catch (error) {
      setOutput(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiClient.getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
            role: 'admin'
          }
        }
      });
      setOutput(JSON.stringify({ data, error }, null, 2));
    } catch (error) {
      setOutput(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await apiClient.getSupabase().auth.signInWithPassword({
        email,
        password,
      });
      setOutput(JSON.stringify({ data, error }, null, 2));
    } catch (error) {
      setOutput(JSON.stringify({ error: error.message }, null, 2));
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await apiClient.getSupabase().auth.signOut();
      setOutput(JSON.stringify({ error }, null, 2));
    } catch (error) {
      setOutput(JSON.stringify({ error: error.message }, null, 2));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Auth Service Test</h1>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Current User:</p>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="space-y-4 mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>

      <div className="space-x-4 mb-4">
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Processing...' : 'Sign Up'}
        </button>
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {loading ? 'Processing...' : 'Sign In'}
        </button>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          {loading ? 'Processing...' : 'Sign Out'}
        </button>
        <button
          onClick={() => handleSocialSignIn('google')}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-300 rounded flex items-center"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
          Sign in with Google
        </button>
        <button
          onClick={() => handleSocialSignIn('facebook')}
          disabled={loading}
          className="px-4 py-2 bg-[#1877F2] text-white rounded flex items-center"
        >
          <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-4 h-4 mr-2" />
          Sign in with Facebook
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Output:</p>
        <pre className="bg-gray-100 p-2 rounded">
          {output}
        </pre>
      </div>
    </div>
  );
}