import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/adminService';
import { Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{
        backgroundColor: 'var(--bg-primary)',
        backgroundImage: 'radial-gradient(circle at 50% 50%, var(--bg-root-gradient-start) 0%, var(--bg-primary) 80%)'
      }}
    >
      {/* Background abstract shapes for premium look */}
      <div
        className="position-absolute rounded-circle filter-blur"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, var(--brand-secondary) 0%, transparent 70%)',
          opacity: 0.12,
          top: '15%',
          left: '10%',
          zIndex: 0
        }}
      />
      <div
        className="position-absolute rounded-circle filter-blur"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
          opacity: 0.1,
          bottom: '15%',
          right: '10%',
          zIndex: 0
        }}
      />

      {/* Main Glassmorphic Login Card */}
      <div
        className="w-100 rounded-4 border animate-slide-up position-relative z-1"
        style={{
          maxWidth: '440px',
          backgroundColor: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--brand-accent)',
                color: 'var(--brand-primary)',
                boxShadow: 'var(--neon-blue-glow)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
            </div>
            <h2 className="fw-extrabold mb-1" style={{ color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>
              Dasvi Admin
            </h2>
            <p className="small text-muted-custom">
              Sign in to manage the learning platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {error && (
              <div
                className="d-flex align-items-center gap-2 p-3 rounded-3 border small animate-fade-in"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444'
                }}
              >
                <ShieldAlert size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="form-label small fw-semibold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                Email or Username
              </label>
              <div className="position-relative">
                <Mail
                  size={18}
                  className="position-absolute top-50 translate-middle-y ms-3"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  type="text"
                  placeholder="admin@dasvi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control rounded-3 ps-5 py-2.5"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="form-label small fw-semibold mb-1.5" style={{ color: 'var(--text-heading)' }}>
                Password
              </label>
              <div className="position-relative">
                <Lock
                  size={18}
                  className="position-absolute top-50 translate-middle-y ms-3"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control rounded-3 ps-5 py-2.5"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-100 py-2.5 mt-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-bold text-white transition-all border-0"
              style={{
                background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)',
                boxShadow: 'var(--neon-blue-glow)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
