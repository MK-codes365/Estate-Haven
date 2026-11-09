import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function RoleSwitcher() {
  const { user, role, demoLogin } = useAuth();

  return (
    <div style={{
      backgroundColor: '#16281E',
      color: '#E0E8E3',
      fontSize: '0.82rem',
      padding: '0.45rem 1rem',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          color: '#C59B27',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontSize: '0.72rem'
        }}>
          <Sparkles size={13} /> Evaluator Role Switcher:
        </span>
        <span>
          Current Persona: <strong style={{ color: '#FFFFFF' }}>{user?.fullName || 'Guest'}</strong>
          <span style={{
            marginLeft: '0.4rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            backgroundColor: role === 'general_manager' ? '#C0392B' : (role === 'reservations_staff' ? '#2980B9' : '#315C45'),
            color: '#FFFFFF'
          }}>
            {role === 'general_manager' ? 'GM (Full Access)' : (role === 'reservations_staff' ? 'Reservations Lead' : 'Guest')}
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ color: '#A0B2A6', fontSize: '0.75rem', marginRight: '0.3rem' }}>Switch Role:</span>
        <button
          onClick={() => demoLogin('guest')}
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: role === 'guest' ? '#FFFFFF' : 'rgba(255,255,255,0.12)',
            color: role === 'guest' ? '#16281E' : '#E0E8E3',
            transition: 'all 0.15s ease'
          }}
        >
          Guest View
        </button>
        <button
          onClick={() => demoLogin('reservations_staff')}
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: role === 'reservations_staff' ? '#2980B9' : 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            transition: 'all 0.15s ease'
          }}
        >
          Staff Inbox
        </button>
        <button
          onClick={() => demoLogin('general_manager')}
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: role === 'general_manager' ? '#C0392B' : 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            transition: 'all 0.15s ease'
          }}
        >
          GM / Admin
        </button>
      </div>
    </div>
  );
}

