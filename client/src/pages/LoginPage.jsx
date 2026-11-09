import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage({ setActivePage }) {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('gm@coffeeridge.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      setActivePage('inbox');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    await demoLogin(role);
    if (role === 'guest') {
      setActivePage('rooms');
    } else {
      setActivePage('inbox');
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '4rem 1.5rem', maxWidth: '480px' }}>
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--coffee-accent)', fontWeight: 700 }}>
            Management Portal
          </span>
          <h1 style={{ fontSize: '1.8rem', marginTop: '0.3rem', color: 'var(--primary-deep)' }}>
            Staff & GM Sign-In
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.3rem' }}>
            Access the AI Enquiry Inbox, Allotment Grid, and PMS Daily Export.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '0.8rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            marginBottom: '1.2rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem 0.65rem 2.2rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem 0.65rem 2.2rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* 1-Click Demo Shortcut Logins */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--coffee-accent)',
            marginBottom: '0.8rem'
          }}>
            <Sparkles size={14} /> One-Click Reviewer Quick Sign-In:
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemo('general_manager')}
              style={{
                padding: '0.65rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #E0B4B4',
                backgroundColor: '#FDF5F5',
                color: '#C0392B',
                textAlign: 'left',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>General Manager (Rajesh Nair)</span>
              <span style={{ fontSize: '0.72rem', color: '#78281F' }}>Full Control &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('reservations_staff')}
              style={{
                padding: '0.65rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #BBD5EB',
                backgroundColor: '#F0F6FB',
                color: '#2980B9',
                textAlign: 'left',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Reservations Lead (Ananya Joshi)</span>
              <span style={{ fontSize: '0.72rem', color: '#1B4F72' }}>Inbox & Allotment &rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('guest')}
              style={{
                padding: '0.65rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                textAlign: 'left',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Guest Visitor View</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Public Site &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

