import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Compass, Calendar, Inbox, BarChart3, ShieldCheck, HeartHandshake, Briefcase, ChevronRight } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { isStaff, isGM, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'The Estate' },
    { id: 'rooms', label: 'Rooms & Villas' },
    { id: 'weddings', label: 'Weddings & Lawns' },
    { id: 'offsites', label: 'Corporate Offsites' }
  ];

  const adminNavItems = [
    { id: 'inbox', label: 'AI Enquiry Inbox', icon: Inbox, alert: true },
    { id: 'allotment', label: 'Rate & Allotment Admin', icon: Calendar },
    { id: 'reports', label: 'ROI & PMS Export', icon: BarChart3 }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(251, 249, 245, 0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'all 0.2s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
        >
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontWeight: 700,
            letterSpacing: '1px',
            color: 'var(--primary-deep)',
            lineHeight: 1.1
          }}>
            THE SERAI RIDGE
          </span>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--coffee-accent)',
            fontWeight: 600
          }}>
            Coffee Estate &bull; Chikkamagaluru &bull; 76 Keys
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.8rem',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: 'var(--text-secondary)'
        }} className="desktop-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                color: activePage === item.id ? 'var(--primary-deep)' : 'var(--text-secondary)',
                fontWeight: activePage === item.id ? 700 : 500,
                borderBottom: activePage === item.id ? '2px solid var(--primary-deep)' : '2px solid transparent',
                padding: '0.4rem 0',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}

          {/* Admin Navigation Pills */}
          {isStaff && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginLeft: '0.8rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid var(--border-light)'
            }}>
              {adminNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      backgroundColor: isActive ? 'var(--primary-deep)' : 'var(--primary-subtle)',
                      color: isActive ? '#FFFFFF' : 'var(--primary-deep)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} />
                    {item.label}
                    {item.id === 'inbox' && (
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#C0392B',
                        display: 'inline-block'
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={() => handleNavClick('rooms')}
            className="btn-gold"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
          >
            <span>Book Direct (10% Off)</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '0.4rem',
              color: 'var(--primary-deep)',
              display: 'flex'
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light)',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Guest Experience
          </span>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                textAlign: 'left',
                padding: '0.5rem 0',
                fontSize: '1rem',
                fontWeight: activePage === item.id ? 700 : 500,
                color: activePage === item.id ? 'var(--primary-deep)' : 'var(--text-secondary)'
              }}
            >
              {item.label}
            </button>
          ))}

          {isStaff && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                Staff Management Portals
              </span>
              {adminNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textAlign: 'left',
                      padding: '0.5rem 0',
                      fontSize: '0.95rem',
                      fontWeight: activePage === item.id ? 700 : 500,
                      color: 'var(--primary-deep)'
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Media query stylesheet inside component for desktop nav */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}

