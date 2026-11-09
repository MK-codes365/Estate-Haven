import React from 'react';
import { CheckCircle, Printer, Download, MapPin, Calendar, Users, Coffee, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ConfirmationPage({ confirmedBooking, setActivePage }) {
  if (!confirmedBooking) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>No Active Confirmation</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Please make a booking or look up an existing reference.
        </p>
        <button onClick={() => setActivePage('rooms')} className="btn-primary">
          Explore Rooms
        </button>
      </div>
    );
  }

  const {
    reference,
    roomName,
    checkInDate,
    checkOutDate,
    nights,
    adults,
    children,
    ratePlan,
    pricing,
    guest,
    payment,
    legalNotices
  } = confirmedBooking;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem', maxWidth: '880px' }}>
      {/* Success Banner */}
      <div style={{
        backgroundColor: 'var(--success-bg)',
        border: '1px solid #C3E6CB',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#1E8449',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <CheckCircle size={32} />
        </div>

        <span style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#1E8449', fontWeight: 700 }}>
          Direct Allotment Confirmed & Guaranteed
        </span>
        <h1 style={{ fontSize: '2.2rem', color: '#155724', marginTop: '0.4rem', marginBottom: '0.6rem' }}>
          Your Stay is Secured!
        </h1>
        <p style={{ color: '#155724', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
          Thank you for booking directly with The Serai Ridge Estate & Resort. Your booking has been deducted from our live inventory and sent to the PMS.
        </p>

        <div style={{
          display: 'inline-block',
          backgroundColor: '#FFFFFF',
          padding: '0.6rem 1.5rem',
          borderRadius: '8px',
          border: '1px dashed #1E8449',
          marginTop: '1.2rem',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--primary-deep)'
        }}>
          Booking Reference: <span style={{ letterSpacing: '1px' }}>{reference}</span>
        </div>
      </div>

      {/* Printable Voucher Card */}
      <div className="card voucher-card" style={{ backgroundColor: '#FFFFFF', marginBottom: '2rem', padding: '2.5rem' }}>
        {/* Voucher Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid var(--border-light)',
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-deep)', marginBottom: '0.2rem' }}>
              The Serai Ridge Estate & Resort
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Chikkamagaluru, Karnataka &bull; 76 Keys Direct Reservation
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Payment Status</span>
            <span className="badge badge-success" style={{ fontSize: '0.82rem' }}>
              &bull; PAID IN FULL (TEST MODE)
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Ref: {payment?.paymentId || 'MOCK_DIRECT_PAY'}
            </span>
          </div>
        </div>

        {/* Guest & Reservation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Primary Guest
            </span>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--primary-deep)', marginTop: '0.2rem' }}>
              {guest?.name}
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>{guest?.email}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>{guest?.phone}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Accommodation
            </span>
            <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--primary-deep)', marginTop: '0.2rem' }}>
              {roomName}
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--coffee-accent)', display: 'block', fontWeight: 600 }}>
              {ratePlan}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>
              {adults} Adults {children > 0 ? `, ${children} Child` : ''} &bull; 1 Room
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Stay Schedule
            </span>
            <div style={{ marginTop: '0.2rem', fontSize: '0.9rem' }}>
              <div><strong>Check-in:</strong> {checkInDate} (From 2:00 PM)</div>
              <div><strong>Check-out:</strong> {checkOutDate} (By 11:00 AM)</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{nights} Nights Duration</div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div style={{
          backgroundColor: 'var(--bg-muted)',
          borderRadius: '8px',
          padding: '1.2rem 1.5rem',
          marginBottom: '1.8rem'
        }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem', color: 'var(--primary-deep)' }}>
            Financial & Tax Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gross Room Base Tariff:</span>
              <span>₹{pricing?.grossBaseAmount?.toLocaleString('en-IN')}</span>
            </div>
            {pricing?.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1E8449', fontWeight: 600 }}>
                <span>Direct Booking Promo Privilege:</span>
                <span>-₹{pricing?.discountAmount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Taxable Base:</span>
              <span>₹{pricing?.netBaseAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>GST ({pricing?.gstPercentage}% slab &bull; CGST + SGST):</span>
              <span>₹{pricing?.gstAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '0.6rem',
              marginTop: '0.4rem',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: 'var(--primary-deep)'
            }}>
              <span>Total Paid:</span>
              <span>₹{pricing?.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Regulatory & Arrival Instructions */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1.2rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-deep)', fontWeight: 600, marginBottom: '0.3rem' }}>
            <ShieldCheck size={16} color="#1E8449" /> Statutory Notice (DPDP Act 2023 & Form C)
          </div>
          <p style={{ marginBottom: '0.5rem' }}>
            {legalNotices?.dpdpAct2023 || 'Recorded under Digital Personal Data Protection Act 2023.'}
          </p>
          <p style={{ color: 'var(--coffee-accent)', fontWeight: 600 }}>
            {legalNotices?.formCNotice || 'Foreign nationals: Original passport and valid Indian visa required physically upon arrival.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={handlePrint}
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Printer size={16} /> Print Official Voucher
        </button>

        <button
          onClick={() => setActivePage('home')}
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>Return to Resort Home</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

