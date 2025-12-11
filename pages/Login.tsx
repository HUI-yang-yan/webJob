
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const err = await login({ username, password });
    if (!err) {
        navigate('/');
    } else {
        setError(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">{t('welcomeBack')}</h2>
          <p className="text-slate-500 mt-2">{t('loginSubtitle')}</p>
        </div>

        <div className="mb-6 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-700">
            <p className="font-bold mb-1">Testing Roles:</p>
            <p>Username: <b>admin</b> (Full Access)</p>
            <p>Username: <b>user</b> (Limited Access)</p>
            <p className="mt-1 text-xs opacity-70">Password: any</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('username')}</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>
        
        <p className="mt-6 text-center text-xs text-slate-400">
          Enterprise OA System © 2023
        </p>
      </div>
    </div>
  );
};

export default Login;
