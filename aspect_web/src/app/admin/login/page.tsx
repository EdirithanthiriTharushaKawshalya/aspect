'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Key, User, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pre-configured admin credentials for quick access and setup testing
    if (formData.email === 'admin@aspect.com' && formData.password === 'aspect2026') {
      // Set simple cookie/session identifier
      localStorage.setItem('aspect_admin_session', 'active');
      router.push('/admin/dashboard');
    } else {
      setTimeout(() => {
        setError('Invalid administrative email or passcode combination.');
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-md px-6">
        
        {/* Card wrapper */}
        <div className="border border-neutral-100 bg-neutral-50/50 p-8 shadow-sm rounded-sm space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-white border border-neutral-100 rounded-full text-neutral-900 mb-2">
              <ShieldCheck className="h-8 w-8 stroke-[1.2]" />
            </div>
            <h1 className="text-xl font-serif uppercase tracking-widest text-neutral-900 font-bold">Admin Portal</h1>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Authorized Staff Only</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs py-3 px-4 text-center rounded-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Operational Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-neutral-200 pl-10 pr-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black bg-white transition-colors"
                  placeholder="admin@aspect.com"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Secret Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-neutral-200 pl-10 pr-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-black bg-white transition-colors"
                  placeholder="••••••••"
                />
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            {/* Login Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-neutral-950 text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Authenticate'
              )}
            </button>
          </form>

          {/* Dev Hint */}
          <div className="text-center pt-2">
            <span className="text-[9px] text-neutral-400 font-light leading-normal block">
              DEMO CREDENTIALS: <br />
              Email: <strong className="text-neutral-600">admin@aspect.com</strong> | Password: <strong className="text-neutral-600">aspect2026</strong>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
