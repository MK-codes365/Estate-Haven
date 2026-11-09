import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-deep)',
      color: '#D1DDD6',
      padding: '4rem 0 2rem 0',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <h3 style={{
              color: '#FFFFFF',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              marginBottom: '0.8rem'
            }}>
              The Serai Ridge Estate & Resort
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#A3B8AD', lineHeight: 1.7, marginBottom: '1.2rem' }}>
              A sanctuary perched amidst 100 acres of shade-grown Arabica and Robusta coffee plantations in the Baba Budangiri Hills. 64 estate suites and 12 private heated plunge pool villas (76 keys).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D1DDD6' }}>
                <MapPin size={16} color="#C59B27" /> Post Box 14, Baba Budangiri Road, Chikkamagaluru, Karnataka 577101
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D1DDD6' }}>
                <Phone size={16} color="#C59B27" /> Direct Desk: +91 8262 298100 / +91 98450 11223
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D1DDD6' }}>
                <Mail size={16} color="#C59B27" /> reservations@coffeeridge.com
              </span>
            </div>
          </div>

          {/* Quick Experience Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.5px' }}>
              Guest Experiences
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <button onClick={() => { setActivePage('rooms'); window.scrollTo(0,0); }} style={{ color: '#A3B8AD' }}>
                  Estate Suites & Private Pool Villas
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('weddings'); window.scrollTo(0,0); }} style={{ color: '#A3B8AD' }}>
                  Bhadra Lawn Destination Weddings
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('offsites'); window.scrollTo(0,0); }} style={{ color: '#A3B8AD' }}>
                  Leadership Offsites & Conference Pavilion
                </button>
              </li>
              <li>
                <span style={{ color: '#C59B27', fontWeight: 600 }}>
                  Direct Booking Privilege: 10% Off with code DIRECT10
                </span>
              </li>
            </ul>
          </div>

          {/* Compliance & DPDP Act 2023 */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.5px' }}>
              Statutory & Privacy Notice
            </h4>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              color: '#B5C8BE'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '0.4rem' }}>
                <ShieldCheck size={16} color="#2ECC71" /> DPDP Act 2023 Compliant
              </div>
              All guest personal data is collected and processed with explicit consent strictly under the Digital Personal Data Protection Act, 2023.
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0.6rem 0' }} />
              <strong>Foreign Nationals Note:</strong> In accordance with Indian Bureau of Immigration regulations, Form C passport and visa verification is completed physically at the resort front desk upon check-in, never online.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#829A8E'
        }}>
          <div>
            &copy; 2026 Company A / The Serai Ridge Estate & Resort. All rights reserved. Direct Allotment Protection System v2.4.
          </div>
          <div>
            Hill-station low bandwidth optimized &bull; GSTIN: 29AABCS8891P1ZX &bull; Zero Agency Commission Guarantee
          </div>
        </div>
      </div>
    </footer>
  );
}

