import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';
import { ShieldCheck, CreditCard, Lock, Sparkles, AlertCircle, ArrowLeft, CheckCircle2, ChevronRight, Info } from 'lucide-react';

export default function BookingPage({ setActivePage, setConfirmedBooking }) {
  const {
    checkIn,
    checkOut,
    adults,
    childrenCount,
    selectedRoom,
    selectedPlanCode,
    promoCode,
    setPromoCode
  } = useBooking();

  // If no room selected, redirect back to rooms
  if (!selectedRoom) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>No Room Selected</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Please choose a suite or plunge pool villa first.
        </p>
        <button onClick={() => setActivePage('rooms')} className="btn-primary">
          Browse Rooms & Villas
        </button>
      </div>
    );
  }

  // Steps: 1 = Details, 2 = Payment Mock
  const [step, setStep] = useState(1);
  const [guestName, setGuestName] = useState('Rohan Mehta');
  const [guestEmail, setGuestEmail] = useState('rohan.mehta@example.com');
  const [guestPhone, setGuestPhone] = useState('+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState('Anniversary stay; requested quiet upper-level suite.');
  const [dpdpConsent, setDpdpConsent] = useState(true);

  // Promo Code State
  const [inputPromo, setInputPromo] = useState(promoCode || 'DIRECT10');
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [promoError, setPromoError] = useState(null);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('mock_card');
  const [processing, setProcessing] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

  // Selected plan calculation
  const plan = selectedRoom.ratePlans.find(p => p.code === selectedPlanCode) || selectedRoom.ratePlans[0];
  const planAddon = plan ? plan.adultAddon * Math.max(1, adults) : 0;
  const dailyBase = selectedRoom.basePrice + planAddon;
  const grossBase = dailyBase * nights;

  // Apply promo calculation
  let calculatedDiscount = 0;
  if (promoDiscount) {
    calculatedDiscount = promoDiscount.calculatedDiscount;
  } else if (inputPromo.toUpperCase() === 'DIRECT10') {
    calculatedDiscount = Math.round(grossBase * 0.10);
  }

  const netBase = Math.max(0, grossBase - calculatedDiscount);
  const effectiveDailyRate = Math.round(netBase / nights);

  // GST Calculation (<= 7500 -> 12%, > 7500 -> 18%)
  const isHighSlab = effectiveDailyRate > 7500;
  const gstRate = isHighSlab ? 0.18 : 0.12;
  const gstAmount = Math.round(netBase * gstRate);
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;
  const totalAmount = netBase + gstAmount;

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoError(null);
    try {
      const res = await api.validatePromo(inputPromo, grossBase);
      setPromoDiscount(res);
      setPromoCode(res.code);
    } catch (err) {
      setPromoError(err.message || 'Invalid promo code');
      setPromoDiscount(null);
    }
  };

  const handleFinalBooking = async () => {
    if (!dpdpConsent) {
      setBookingError('Please provide consent for processing booking information under the DPDP Act 2023.');
      return;
    }

    setProcessing(true);
    setBookingError(null);

    try {
      const res = await api.createBooking({
        roomId: selectedRoom.id,
        ratePlanCode: plan.code,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults,
        children: childrenCount,
        roomsCount: 1,
        guestName,
        guestEmail,
        guestPhone,
        promoCode: calculatedDiscount > 0 ? (promoDiscount?.code || 'DIRECT10') : null,
        specialRequests,
        paymentMethod
      });

      setConfirmedBooking(res.booking);
      setActivePage('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingError(err.message || 'Booking failed due to allotment or payment error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem', maxWidth: '1080px' }}>
      {/* Top Breadcrumb & Step Tracker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => setActivePage('rooms')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Rooms
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: step === 1 ? 700 : 500, color: step === 1 ? 'var(--primary-deep)' : 'var(--text-muted)' }}>
            1. Guest Details
          </span>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ fontWeight: step === 2 ? 700 : 500, color: step === 2 ? 'var(--primary-deep)' : 'var(--text-muted)' }}>
            2. Payment (Test Mode)
          </span>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)' }}>
            3. Instant Confirmation
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Form & Payment */}
        <div>
          {bookingError && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '1.2rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Booking Alert:</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>{bookingError}</p>
              </div>
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Guest Information */
            <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Guest Information</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Your details are encrypted and securely stored for check-in identification.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Primary Guest Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: '6px'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-light)',
                          borderRadius: '6px'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--border-light)',
                          borderRadius: '6px'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Special Requests / Dietary Preferences
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      placeholder="e.g. Early check-in, anniversary setup, non-dairy breakfast, high-floor suite..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: '6px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* DPDP Act 2023 & Form C Statutory Notice */}
                  <div style={{
                    backgroundColor: 'var(--bg-muted)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.82rem',
                    lineHeight: 1.6
                  }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={dpdpConsent}
                        onChange={(e) => setDpdpConsent(e.target.checked)}
                        style={{ marginTop: '3px' }}
                        required
                      />
                      <span>
                        I consent to the collection and processing of my contact information solely for estate reservation purposes in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong>.
                      </span>
                    </label>

                    <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                      <Info size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                      <strong>Foreign Guests (Form C Notice):</strong> In accordance with Indian immigration regulations, foreign passport holders will submit original passport and visa for Form C registration at the resort reception upon check-in, not online.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.85rem', width: '100%', marginTop: '0.5rem' }}
                  >
                    <span>Proceed to Secure Test Payment</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Step 2: Test Payment */
            <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Select Test Payment</h2>
                <span className="badge badge-warning">Simulated Sandbox</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Test mode active. No actual money will be charged. This demonstrates instantaneous payment settlement and allotment deduction.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.8rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: paymentMethod === 'mock_card' ? '2px solid var(--primary-deep)' : '1px solid var(--border-light)',
                  borderRadius: '8px',
                  backgroundColor: paymentMethod === 'mock_card' ? 'var(--primary-subtle)' : '#FFFFFF',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mock_card"
                    checked={paymentMethod === 'mock_card'}
                    onChange={() => setPaymentMethod('mock_card')}
                  />
                  <CreditCard size={20} color="var(--primary-deep)" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>Instant Card / UPI Payment (Mock Razorpay)</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Test Visa / Mastercard / UPI QR</span>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: paymentMethod === 'mock_netbanking' ? '2px solid var(--primary-deep)' : '1px solid var(--border-light)',
                  borderRadius: '8px',
                  backgroundColor: paymentMethod === 'mock_netbanking' ? 'var(--primary-subtle)' : '#FFFFFF',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mock_netbanking"
                    checked={paymentMethod === 'mock_netbanking'}
                    onChange={() => setPaymentMethod('mock_netbanking')}
                  />
                  <Lock size={20} color="var(--primary-deep)" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>Net Banking Simulator</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>HDFC / ICICI / SBI / Axis Test Gateway</span>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Edit Details
                </button>
                <button
                  onClick={handleFinalBooking}
                  disabled={processing}
                  className="btn-gold"
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  {processing ? 'Processing Allotment & Payment...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} & Confirm`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Pricing Breakdown */}
        <div className="card" style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
            Reservation Summary
          </h3>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
            <img
              src={selectedRoom.photos[0]}
              alt={selectedRoom.name}
              style={{ width: '90px', height: '70px', borderRadius: '6px', objectFit: 'cover' }}
            />
            <div>
              <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--primary-deep)' }}>
                {selectedRoom.name}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {plan.name}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Check-In:</span>
              <strong>{checkIn}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Check-Out:</span>
              <strong>{checkOut}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
              <strong>{nights} {nights === 1 ? 'Night' : 'Nights'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Occupancy:</span>
              <strong>{adults} Adults {childrenCount > 0 ? `, ${childrenCount} Child` : ''}</strong>
            </div>
          </div>

          {/* Promo Code Input */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.2rem',
            border: '1px solid var(--border-light)'
          }}>
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Direct Booking Promo Code
            </span>
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={inputPromo}
                onChange={(e) => setInputPromo(e.target.value.toUpperCase())}
                placeholder="DIRECT10"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.8rem', fontSize: '0.82rem' }}>
                Apply
              </button>
            </form>
            {calculatedDiscount > 0 && (
              <span style={{ color: '#1E8449', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem', fontWeight: 600 }}>
                <CheckCircle2 size={13} /> Code {promoDiscount?.code || 'DIRECT10'} Applied (-₹{calculatedDiscount.toLocaleString('en-IN')})
              </span>
            )}
            {promoError && (
              <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.4rem', display: 'block' }}>
                {promoError}
              </span>
            )}
          </div>

          {/* Itemized Price & GST Breakdown */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Room Tariff ({nights} nights &bull; {plan.code}):</span>
              <span>₹{grossBase.toLocaleString('en-IN')}</span>
            </div>

            {calculatedDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1E8449', fontWeight: 600 }}>
                <span>Direct Booking Saving:</span>
                <span>-₹{calculatedDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Taxable Base Amount:</span>
              <span>₹{netBase.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              <span>
                GST ({isHighSlab ? '18%' : '12%'} &bull; CGST {isHighSlab ? '9%' : '6%'} + SGST {isHighSlab ? '9%' : '6%'}):
              </span>
              <span>₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '2px solid var(--border-light)',
              paddingTop: '0.8rem',
              marginTop: '0.4rem'
            }}>
              <div>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary-deep)' }}>Total Amount:</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  (Inclusive of all applicable Indian taxes)
                </span>
              </div>
              <strong style={{ fontSize: '1.45rem', color: 'var(--primary-deep)' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
