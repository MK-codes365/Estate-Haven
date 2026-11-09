import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Calendar, Users, Check, AlertCircle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function RoomsPage({ setActivePage }) {
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    setSelectedRoom,
    setSelectedPlanCode
  } = useBooking();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanByRoom, setSelectedPlanByRoom] = useState({});

  useEffect(() => {
    fetchRooms();
  }, [checkIn, checkOut, adults, childrenCount]);

  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRooms({
        checkIn,
        checkOut,
        adults,
        children: childrenCount
      });
      setRooms(data.rooms || []);

      // Default all rooms to CP (Continental Bed & Breakfast) plan
      const defaultPlans = {};
      (data.rooms || []).forEach(r => {
        defaultPlans[r.id] = 'CP';
      });
      setSelectedPlanByRoom(defaultPlans);
    } catch (err) {
      console.error('Failed to load rooms:', err);
      setError(err.message || 'Unable to fetch room availability');
    } finally {
      setLoading(false);
    }
  }

  const handlePlanChange = (roomId, planCode) => {
    setSelectedPlanByRoom(prev => ({
      ...prev,
      [roomId]: planCode
    }));
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    const chosenPlan = selectedPlanByRoom[room.id] || 'CP';
    setSelectedPlanCode(chosenPlan);
    setActivePage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ maxWidth: '750px', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--coffee-accent)', fontWeight: 700 }}>
          Estate Accommodations &bull; 76 Keys
        </span>
        <h1 style={{ fontSize: '2.6rem', marginTop: '0.4rem', marginBottom: '0.8rem' }}>
          Select Your Stay & Direct Allotment
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Live inventory straight from our Chikkamagaluru estate reservation desk. All rates include high-speed Wi-Fi, estate walks, and zero booking commission.
        </p>
      </div>

      {/* Date Search & Availability Filter Bar */}
      <div className="card" style={{ marginBottom: '2.5rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.2rem',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                fontWeight: 600,
                color: 'var(--primary-deep)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                fontWeight: 600,
                color: 'var(--primary-deep)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Users size={13} style={{ display: 'inline', marginRight: '4px' }} /> Adults
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Users size={13} style={{ display: 'inline', marginRight: '4px' }} /> Children
            </label>
            <select
              value={childrenCount}
              onChange={(e) => setChildrenCount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              <option value="0">0 Children</option>
              <option value="1">1 Child</option>
              <option value="2">2 Children</option>
            </select>
          </div>

          <div>
            <button
              onClick={fetchRooms}
              className="btn-primary"
              style={{ width: '100%', padding: '0.68rem 1rem' }}
            >
              Refresh Availability
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '1rem',
          paddingTop: '0.8rem',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#1E8449', fontWeight: 600 }}>
            <ShieldCheck size={15} /> Direct Allotment Protection Active
          </span>
          <span>&bull;</span>
          <span>Overbooking defense system ensures your reservation is guaranteed instantly.</span>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-light)',
            borderTopColor: 'var(--primary-deep)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Checking live Chikkamagaluru estate allotment...
          </p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && !loading && (
        <div style={{
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          padding: '1.2rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '2rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Room Listing Grid */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {rooms.map(room => {
            const chosenPlanCode = selectedPlanByRoom[room.id] || 'CP';
            const chosenPlan = room.ratePlans.find(p => p.code === chosenPlanCode) || room.ratePlans[0];
            const planAddon = chosenPlan ? chosenPlan.adultAddon * Math.max(1, adults) : 0;
            const effectiveDailyRate = room.basePrice + planAddon;

            // GST slab calculation (<= 7500 -> 12%, > 7500 -> 18%)
            const isHighSlab = effectiveDailyRate > 7500;
            const gstRate = isHighSlab ? 0.18 : 0.12;
            const dailyGst = Math.round(effectiveDailyRate * gstRate);
            const nights = room.availability ? (room.availability.nights || 1) : 1;
            const totalWithGst = (effectiveDailyRate + dailyGst) * nights;

            const isAvailable = room.availability ? room.availability.available : true;
            const remainingCount = room.availability ? room.availability.remaining : room.defaultWebsiteAllotment;

            return (
              <div
                key={room.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  border: isAvailable ? '1px solid var(--border-light)' : '1px solid #E0B4B4'
                }}
              >
                {/* Room Image & Badges */}
                <div style={{ position: 'relative', minHeight: '300px' }}>
                  <img
                    src={room.photos[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={room.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">
                      {room.category === 'villa' ? 'Private Villa' : 'Estate Suite'}
                    </span>
                    <span className="badge badge-gold">
                      {room.totalKeys} Total Keys
                    </span>
                  </div>

                  {/* Allotment Badge */}
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                    {isAvailable ? (
                      <span className="badge badge-success" style={{ boxShadow: 'var(--shadow-sm)' }}>
                        &bull; {remainingCount} Direct Allotment Available
                      </span>
                    ) : (
                      <span className="badge badge-danger" style={{ boxShadow: 'var(--shadow-sm)' }}>
                        &bull; Sold Out on Direct Website
                      </span>
                    )}
                  </div>
                </div>

                {/* Room Details & Pricing Content */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.6rem' }}>{room.name}</h2>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {room.sizeSqft} sq.ft &bull; Up to {room.maxAdults} Adults + {room.maxChildren} Child
                      </span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.2rem', lineHeight: 1.6 }}>
                      {room.description}
                    </p>

                    {/* Amenities list */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {room.amenities.slice(0, 5).map((amenity, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            backgroundColor: 'var(--bg-muted)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            color: 'var(--text-primary)'
                          }}
                        >
                          <Check size={12} color="var(--primary-forest)" />
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Rate Plan Selector (EP, CP, MAP) */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                        Select Rate & Meal Plan:
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
                        {room.ratePlans.map(plan => {
                          const isSelected = chosenPlanCode === plan.code;
                          const planTotal = room.basePrice + (plan.adultAddon * Math.max(1, adults));
                          return (
                            <button
                              key={plan.code}
                              onClick={() => handlePlanChange(room.id, plan.code)}
                              style={{
                                border: isSelected ? '2px solid var(--primary-deep)' : '1px solid var(--border-light)',
                                backgroundColor: isSelected ? 'var(--primary-subtle)' : '#FFFFFF',
                                borderRadius: '8px',
                                padding: '0.6rem 0.8rem',
                                textAlign: 'left',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '0.85rem', color: isSelected ? 'var(--primary-deep)' : 'var(--text-primary)' }}>
                                  {plan.code}
                                </strong>
                                {isSelected && <Check size={14} color="var(--primary-deep)" />}
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>
                                {plan.code === 'EP' ? 'Room Only' : (plan.code === 'CP' ? 'Bed & Breakfast' : 'Breakfast + Dinner')}
                              </span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--coffee-rich)', marginTop: '0.2rem', display: 'block' }}>
                                ₹{planTotal.toLocaleString('en-IN')}/night
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Price Summary & Direct Checkout Button */}
                  <div style={{
                    paddingTop: '1.2rem',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
                          ₹{effectiveDailyRate.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          / night ({nights} {nights === 1 ? 'night' : 'nights'})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>+ {isHighSlab ? '18% GST' : '12% GST'} (₹{dailyGst.toLocaleString('en-IN')}/night)</span>
                        <span>&bull;</span>
                        <span style={{ color: 'var(--terracotta)', fontWeight: 600 }}>10% Off with DIRECT10</span>
                      </div>
                    </div>

                    {isAvailable ? (
                      <button
                        onClick={() => handleSelectRoom(room)}
                        className="btn-primary"
                        style={{ padding: '0.75rem 1.6rem' }}
                      >
                        <span>Reserve Direct</span>
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        disabled
                        style={{
                          backgroundColor: '#EAE6DF',
                          color: '#8A8275',
                          padding: '0.75rem 1.4rem',
                          borderRadius: '6px',
                          cursor: 'not-allowed',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        Allotment Sold Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

