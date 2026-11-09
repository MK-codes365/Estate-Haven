import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Sparkles, Calendar, Users, Coffee, ArrowRight, ShieldCheck, Sun, Mountain, Waves, Award } from 'lucide-react';

export default function HomePage({ setActivePage }) {
  const { checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults, childrenCount, setChildrenCount } = useBooking();

  const handleSearch = (e) => {
    e.preventDefault();
    setActivePage('rooms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(18, 38, 27, 0.55), rgba(18, 38, 27, 0.7)), url("https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFFFFF',
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <Coffee size={14} color="#C59B27" /> Chikkamagaluru &bull; 76 Keys Private Coffee Sanctuary
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            color: '#FFFFFF',
            fontWeight: 600,
            letterSpacing: '-0.5px',
            marginBottom: '1.2rem',
            lineHeight: 1.15
          }}>
            Where Morning Mist Meets Coffee Blossoms
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#E0EDE5',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            fontWeight: 300,
            lineHeight: 1.7
          }}>
            Escape to 100 acres of shade-grown Arabica estate in Karnataka’s Western Ghats. Book direct for our guaranteed lowest tariff, priority villa allotment, and complimentary coffee harvest safaris.
          </p>

          {/* Quick Direct Booking Search Bar */}
          <div style={{
            backgroundColor: '#FFFFFF',
            color: 'var(--text-primary)',
            borderRadius: '16px',
            padding: '1.2rem 1.5rem',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <form onSubmit={handleSearch} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Check-In
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
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Check-Out
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
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  <Users size={13} style={{ display: 'inline', marginRight: '4px' }} /> Guests
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.6rem',
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
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.6rem',
                      border: '1px solid var(--border-light)',
                      borderRadius: '6px',
                      fontWeight: 600
                    }}
                  >
                    <option value="0">0 Kids</option>
                    <option value="1">1 Kid</option>
                    <option value="2">2 Kids</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.8rem 1rem', height: '46px' }}
                >
                  <span>Check Availability</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.8rem',
              paddingTop: '0.8rem',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--terracotta)', fontWeight: 600 }}>
                <Sparkles size={14} /> Direct Privilege: 10% Extra Discount automatically applied with promo code DIRECT10
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} color="#1E8449" /> Real-time Allotment &bull; Zero Overbooking Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Booking Advantage Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--coffee-accent)', fontWeight: 700 }}>
              The Direct Difference
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '0.8rem' }}>
              Why Book Directly With Us?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
              Bypass online travel agency markups. When you book directly on our website, every rupee goes straight into preserving our heritage estate and pampering you.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.8rem'
          }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary-deep)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary-deep)' }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Guaranteed Lowest Rate</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Save 10% to 15% compared to commercial travel agencies with promo code <code>DIRECT10</code>.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--gold-warm)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--gold-warm)' }}>
                <Coffee size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Complimentary Coffee Safaris</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Exclusive guided plantation harvest walks and private bean-to-cup brewing workshops for direct guests.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--terracotta)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#FBECE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--terracotta)' }}>
                <Sun size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Flexible Check-in & Cancellation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Direct human assistance from our local Chikkamagaluru front desk without call-center runarounds.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary-forest)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary-forest)' }}>
                <Waves size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Priority Villa Allocation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Direct guests receive preferential room placement with superior valley views and secluded privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Rooms Preview */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-muted)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--coffee-accent)', fontWeight: 700 }}>
                76 Luxury Keys
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.3rem' }}>
                Suites & Heated Plunge Pool Villas
              </h2>
            </div>
            <button
              onClick={() => { setActivePage('rooms'); window.scrollTo(0, 0); }}
              className="btn-secondary"
            >
              <span>View All 4 Categories</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {/* Card 1: Private Plunge Pool Villa */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '240px' }}>
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
                  alt="Private Plunge Pool Villa"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge badge-gold" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  Signature Villa &bull; 12 Keys
                </span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Private Plunge Pool Villa</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    1,350 sq.ft ultra-luxury villa featuring private heated plunge pool, estate canopy sun deck, and dedicated butler service.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className="badge badge-primary">Heated Pool</span>
                    <span className="badge badge-primary">Butler On-Call</span>
                    <span className="badge badge-primary">4 Guests</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>From</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-deep)' }}>₹22,000</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}> / night + 18% GST</span>
                  </div>
                  <button
                    onClick={() => { setActivePage('rooms'); window.scrollTo(0, 0); }}
                    className="btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
                  >
                    Select Villa
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Estate Valley Suite */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '240px' }}>
                <img
                  src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80"
                  alt="Estate Valley Suite"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge badge-primary" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  Estate Suite &bull; 24 Keys
                </span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Estate Valley Suite</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    680 sq.ft glass-walled suite suspended over the plantation valley with mountain sunrise balcony and soaking terrazzo tub.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className="badge badge-primary">Valley Balcony</span>
                    <span className="badge badge-primary">Terrazzo Tub</span>
                    <span className="badge badge-primary">3 Guests</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>From</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-deep)' }}>₹9,800</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}> / night + 18% GST</span>
                  </div>
                  <button
                    onClick={() => { setActivePage('rooms'); window.scrollTo(0, 0); }}
                    className="btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
                  >
                    Select Suite
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Plantation Classic Room */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '240px' }}>
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                  alt="Plantation Classic Room"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="badge badge-info" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  Classic &bull; 28 Keys
                </span>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Plantation Classic Room</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    440 sq.ft colonial teakwood estate room overlooking coffee groves with private veranda and artisan pour-over coffee bar.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className="badge badge-primary">Estate Veranda</span>
                    <span className="badge badge-primary">12% GST Slab</span>
                    <span className="badge badge-primary">2 Guests</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>From</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-deep)' }}>₹7,200</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}> / night + 12% GST</span>
                  </div>
                  <button
                    onClick={() => { setActivePage('rooms'); window.scrollTo(0, 0); }}
                    className="btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}
                  >
                    Select Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events & Offsites Dual Banner */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Weddings Card */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              minHeight: '380px',
              backgroundImage: 'linear-gradient(rgba(25, 51, 37, 0.65), rgba(25, 51, 37, 0.8)), url("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#FFFFFF',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              <span className="badge badge-gold" style={{ width: 'fit-content', marginBottom: '1rem' }}>
                Bhadra Lawns &bull; Up to 500 Guests
              </span>
              <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.8rem' }}>
                Destination Weddings in the Clouds
              </h3>
              <p style={{ color: '#E0EDE5', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Exchange vows framed by emerald silver oak canopies and mountain breezes. Residential buyouts with all 76 keys and bespoke culinary experiences.
              </p>
              <button
                onClick={() => { setActivePage('weddings'); window.scrollTo(0, 0); }}
                className="btn-gold"
                style={{ width: 'fit-content' }}
              >
                <span>Plan Your Wedding</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Corporate Offsites Card */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              minHeight: '380px',
              backgroundImage: 'linear-gradient(rgba(36, 70, 52, 0.65), rgba(36, 70, 52, 0.85)), url("https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#FFFFFF',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              <span className="badge badge-info" style={{ width: 'fit-content', marginBottom: '1rem' }}>
                The Planter’s Conference Pavilion
              </span>
              <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.8rem' }}>
                Leadership & Corporate Offsites
              </h3>
              <p style={{ color: '#E0EDE5', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Recharge your team in serene seclusion. State-of-the-art conference facilities, fiber connectivity, team coffee harvest competitions, and outdoor barbecue networking.
              </p>
              <button
                onClick={() => { setActivePage('offsites'); window.scrollTo(0, 0); }}
                className="btn-primary"
                style={{ width: 'fit-content', backgroundColor: '#FFFFFF', color: 'var(--primary-deep)' }}
              >
                <span>Explore Offsite Packages</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

