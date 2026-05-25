'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { Shield, Key, Mail, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    const checkUser = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/admin');
        }
      } else {
        const mockAuth = localStorage.getItem('gloopo_mock_admin_auth');
        if (mockAuth === 'true') {
          router.push('/admin');
        }
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        // --- LIVE SUPABASE AUTHENTICATION ---
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          throw new Error(authError.message);
        }

        setSuccess('Authentication successful! Redirecting...');
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      } else {
        // --- MOCK MODE AUTHENTICATION ---
        // Let's use demo credentials: admin@gloopo.com / admin123
        if (email.toLowerCase() === 'admin@gloopo.com' && password === 'admin123') {
          localStorage.setItem('gloopo_mock_admin_auth', 'true');
          localStorage.setItem('gloopo_mock_admin_email', email);
          setSuccess('Mock Login successful! Redirecting to Dashboard...');
          setTimeout(() => {
            router.push('/admin');
          }, 1200);
        } else {
          throw new Error('Invalid email or password. Hint: Use admin@gloopo.com & admin123');
        }
      }
    } catch (err: any) {
      let msg = err.message || 'An unexpected error occurred.';
      if (msg.toLowerCase().includes('failed to fetch')) {
        msg = 'Failed to connect to Supabase (Failed to fetch). This is a network connection error. ' +
              'Please verify that the NEXT_PUBLIC_SUPABASE_URL in your .env.local file is correct and doesn\'t have a typo. ' +
              'CRITICAL: If you just created or edited the .env.local file, you MUST restart your Next.js development server (run npm run dev again) for the changes to take effect!';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="bg-decorations">
        <div className="glow-sphere green"></div>
        <div className="glow-sphere neon"></div>
      </div>

      <div className="login-card-wrapper">

        <div className="glass-card login-card">
          <div className="card-header">
            <div className="shield-icon">
              <Shield size={32} />
            </div>
            <h1>Admin Control Portal</h1>
            <p>Authorized personnel only. Please verify your credentials.</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mock-badge-card">
              <div className="mock-badge-header">
                <AlertTriangle size={16} className="warning-icon" />
                <span>Mock Auth Active</span>
              </div>
              <p>
                Supabase credentials not configured in <code>.env.local</code>. <br />
                Login using: <code className="highlight">admin@gloopo.com</code> &amp; <code className="highlight">admin123</code>
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="alert-box error">{error}</div>}
            {success && <div className="alert-box success">{success}</div>}

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon-box">
                  <Mail size={17} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@gloopo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Security Password</label>
              <div className="input-wrapper">
                <span className="input-icon-box">
                  <Key size={17} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #030806;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .bg-decorations {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
          pointer-events: none;
        }

        .glow-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(160px);
          opacity: 0.12;
        }

        .glow-sphere.green {
          width: 400px;
          height: 400px;
          background: var(--primary);
          top: -100px;
          right: -100px;
        }

        .glow-sphere.neon {
          width: 350px;
          height: 350px;
          background: var(--accent);
          bottom: -50px;
          left: -50px;
        }

        .login-card-wrapper {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }


        .login-card {
          padding: 3rem 2.5rem;
          border-radius: var(--radius-xl);
          background: rgba(4, 12, 10, 0.9);
          border: 1px solid var(--glass-border);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .login-card:hover {
          transform: none;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .shield-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: rgba(0, 255, 136, 0.06);
          border: 1px solid rgba(0, 255, 136, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);
        }

        .card-header h1 {
          font-size: 1.75rem;
          color: #fff;
          margin-bottom: 0.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .card-header p {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .mock-badge-card {
          background: rgba(187, 255, 0, 0.03);
          border: 1px solid rgba(187, 255, 0, 0.15);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .mock-badge-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent);
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .mock-badge-card p {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .mock-badge-card code {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          color: #fff;
          font-family: monospace;
        }

        .mock-badge-card code.highlight {
          color: var(--primary);
          font-weight: bold;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .alert-box {
          padding: 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .alert-box.error {
          background: rgba(255, 77, 77, 0.08);
          border: 1px solid rgba(255, 77, 77, 0.25);
          color: #ff4d4d;
        }

        .alert-box.success {
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.25);
          color: var(--primary);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .input-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.08);
        }

        .input-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.9rem;
          color: var(--text-muted);
          border-right: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
          transition: color 0.3s ease, border-color 0.3s ease;
        }

        .input-wrapper:focus-within .input-icon-box {
          color: var(--primary);
          border-right-color: rgba(0, 255, 136, 0.2);
        }

        .input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 1rem 1rem;
          color: #fff;
          font-size: 0.95rem;
          font-family: inherit;
        }

        .input-wrapper input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .pw-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.9rem;
          background: none;
          border: none;
          border-left: 1px solid var(--glass-border);
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
          flex-shrink: 0;
        }

        .pw-toggle:hover {
          color: var(--primary);
        }

        .input-wrapper:focus-within .pw-toggle {
          border-left-color: rgba(0, 255, 136, 0.2);
        }

        .login-btn {
          width: 100%;
          padding: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(3, 8, 6, 0.15);
          border-top-color: #030806;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
