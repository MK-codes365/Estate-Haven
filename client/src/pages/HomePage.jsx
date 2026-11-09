import React, { useState, useRef } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  Calendar,
  Users,
  Coffee,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Waves,
  Sun,
  Compass,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function HomePage({ setActivePage }) {
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount
  } = useBooking();

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActivePage('rooms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade" style={{ backgroundColor: '#0A120E', color: '#FAF8F5' }}>

      {/* =========================================================================
          SECTION 1: HERO COVER VIDEO (CRUE-CREATIVE IMMERSIVE OPENER)
          ========================================================================= */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        {/* Full-bleed ambient resort video from public/Video 1.mp4 */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.62) contrast(1.08)',
            backgroundColor: '#0A120E',
            zIndex: 1
          }}
        >
          <source src="/Video 1.mp4" type="video/mp4" />
          <track kind="captions" src="data:text/vtt,WEBVTT%0A%0A00:00:00.000%20-->%2000:00:14.000%0A(Ambient%20mist%20over%20the%20coffee%20estate)" default />
        </video>

        {/* Cinematic dark aesthetic vignette overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, rgba(10,18,14,0.3) 0%, rgba(10,18,14,0.85) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        {/* Floating Sound Toggle Pill (Awwwards / CRUE-Creative Style) */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Turn ambient sound on' : 'Mute ambient sound'}
          style={{
            position: 'absolute',
            top: 'clamp(1rem, 3vw, 2rem)',
            right: 'clamp(1rem, 3vw, 2rem)',
            zIndex: 25,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(10, 18, 14, 0.78)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '9999px',
            padding: '0.5rem 1.1rem',
            minHeight: '44px',
            color: '#FAF8F5',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          {isMuted ? (
            <>
              <VolumeX size={15} color="#C59B27" />
              <span>SOUND OFF</span>
            </>
          ) : (
            <>
              <Volume2 size={15} color="#C59B27" />
              <span>SOUND ON</span>
            </>
          )}
        </button>

        {/* Center Editorial Title Typography (Awwwards Big Display Style) */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(4rem, 8vw, 6rem) clamp(1.2rem, 4vw, 3rem) 0 clamp(1.2rem, 4vw, 3rem)',
          maxWidth: '1280px',
          margin: 'auto 0 clamp(1.5rem, 4vw, 3rem) 0'
        }}>
          {/* Pill Badge matching design */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'rgba(12, 22, 17, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '9999px',
            padding: '0.4rem 1.15rem',
            marginBottom: '1.2rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            maxWidth: '100%',
            flexWrap: 'wrap'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#C59B27',
              display: 'inline-block',
              flexShrink: 0
            }} />
            <span style={{
              fontSize: 'clamp(0.68rem, 1.8vw, 0.76rem)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#D8E8DF',
              fontWeight: 700
            }}>
              CHIKKAMAGALURU &bull; 76 KEYS COFFEE SANCTUARY
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 7vw, 6.4rem)',
            color: '#FFFFFF',
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: '-1.5px',
            marginBottom: '1.4rem',
            textTransform: 'none'
          }}>
            Where Morning Mist <br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#EAE5DD' }}>Meets Coffee Blossoms.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.6vw, 1.35rem)',
            color: '#E0EDE5',
            maxWidth: '680px',
            lineHeight: 1.6,
            fontWeight: 300,
            marginBottom: '2rem'
          }}>
            100 acres of shade-grown Arabica estate in the Western Ghats. Direct booking privilege with zero OTA commissions and guaranteed lowest tariff.
          </p>
        </div>

        {/* Bottom Booking Console floating over hero */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'rgba(20, 36, 28, 0.94)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          padding: 'clamp(1rem, 2.5vw, 1.4rem) clamp(1rem, 4vw, 3rem)'
        }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end'
            }}>
              <div>
                <label htmlFor="booking-check-in" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#D8E8DF', marginBottom: '0.4rem' }}>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> Check-In
                </label>
                <input
                  id="booking-check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.8rem',
                    minHeight: '46px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontWeight: 600
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="booking-check-out" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#D8E8DF', marginBottom: '0.4rem' }}>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> Check-Out
                </label>
                <input
                  id="booking-check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.8rem',
                    minHeight: '46px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontWeight: 600
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="booking-adults" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#D8E8DF', marginBottom: '0.4rem' }}>
                  <Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> Guests & Children
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    id="booking-adults"
                    aria-label="Number of Adults"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    style={{
                      flex: 1,
                      padding: '0.75rem 0.6rem',
                      minHeight: '46px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontWeight: 600
                    }}
                  >
                    <option value="1" style={{ color: '#000' }}>1 Adult</option>
                    <option value="2" style={{ color: '#000' }}>2 Adults</option>
                    <option value="3" style={{ color: '#000' }}>3 Adults</option>
                    <option value="4" style={{ color: '#000' }}>4 Adults</option>
                  </select>
                  <select
                    id="booking-children"
                    aria-label="Number of Children"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    style={{
                      flex: 1,
                      padding: '0.75rem 0.6rem',
                      minHeight: '46px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontWeight: 600
                    }}
                  >
                    <option value="0" style={{ color: '#000' }}>0 Kids</option>
                    <option value="1" style={{ color: '#000' }}>1 Kid</option>
                    <option value="2" style={{ color: '#000' }}>2 Kids</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-gold"
                  aria-label="Reserve Direct on official website"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1.4rem',
                    minHeight: '46px',
                    fontSize: '0.88rem',
                    letterSpacing: '0.5px',
                    boxShadow: '0 6px 20px rgba(197, 155, 39, 0.35)'
                  }}
                >
                  <span>Reserve Direct</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: INFINITE RUNNING MARQUEE (CRUE CREATIVE SIGNATURE BANNER)
          ========================================================================= */}
      <section style={{
        overflow: 'hidden',
        backgroundColor: '#0F1A14',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '1.4rem 0'
      }}>
        <div className="animate-marquee-left" style={{ gap: '2.5rem', alignItems: 'center' }}>
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', letterSpacing: '2px', color: '#FAF8F5', textTransform: 'uppercase' }}>
                The Serai Ridge Estate &bull; Chikkamagaluru
              </span>
              <span style={{ color: '#C59B27', fontSize: '1.4rem' }}>&bull;</span>
              <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', letterSpacing: '2px', color: '#A0B4AA', textTransform: 'uppercase', fontStyle: 'italic' }}>
                76 Keys Matrix: 64 Suites & 12 Plunge Pool Villas
              </span>
              <span style={{ color: '#C59B27', fontSize: '1.4rem' }}>&bull;</span>
              <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', letterSpacing: '2px', color: '#FAF8F5', textTransform: 'uppercase' }}>
                Guaranteed Direct Allotment &bull; Zero Overbooking Hard Lock
              </span>
              <span style={{ color: '#C59B27', fontSize: '1.4rem' }}>&bull;</span>
              <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', letterSpacing: '2px', color: '#C59B27', textTransform: 'uppercase' }}>
                100 Acres Arabica Plantation &bull; Bhadra Lawns
              </span>
              <span style={{ color: '#C59B27', fontSize: '1.4rem' }}>&bull;</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: EDITORIAL ABOUT & STORYTELLING WITH PHOTO 1 & PHOTO 2
          ========================================================================= */}
      <section style={{ padding: '7rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Bold Typography & Narrative */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.74rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#C59B27',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Compass size={14} /> Heritage In Baba Budangiri Hills
            </div>

            <h2 style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1.15,
              marginBottom: '1.6rem'
            }}>
              Crafted For Those Who Value Stillness Over Speed.
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: '#D8E8DF',
              lineHeight: 1.8,
              marginBottom: '1.8rem',
              fontWeight: 300
            }}>
              Surrounded by coffee hills and centuries-old silver oak canopies, The Serai Ridge is Company A’s flagship ₹28-crore estate retreat. Designed with expansive private decks, heated plunge pools, and intimate planter verandas.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '2.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '1.8rem'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '2.4rem', fontFamily: 'var(--font-serif)', color: '#C59B27', fontWeight: 600 }}>
                  76 Keys
                </span>
                <span style={{ fontSize: '0.82rem', color: '#D8E8DF', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  64 Rooms & 12 Villas
                </span>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '2.4rem', fontFamily: 'var(--font-serif)', color: '#C59B27', fontWeight: 600 }}>
                  100%
                </span>
                <span style={{ fontSize: '0.82rem', color: '#D8E8DF', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Direct Allotment Isolation
                </span>
              </div>
            </div>

            <button
              onClick={() => { setActivePage('rooms'); window.scrollTo(0, 0); }}
              className="btn-primary"
              style={{
                backgroundColor: '#FAF8F5',
                color: '#12261B',
                padding: '0.9rem 2rem',
                fontSize: '0.9rem',
                letterSpacing: '0.5px'
              }}
            >
              <span>Explore Room Suites & Villas</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Column: Layered Editorial Image Composition (Photo 1 & Photo 2) */}
          <div style={{ position: 'relative' }}>
            {/* Primary Large Image: Photo 1 */}
            <div className="editorial-img-wrap" style={{
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
              height: 'clamp(280px, 45vw, 480px)'
            }}>
              <img
                src="/Photo 1.webp"
                alt="Serai Ridge Estate Grounds & Architecture"
                loading="lazy"
                decoding="async"
                width="800"
                height="533"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Overlapping Accent Image: Photo 2 */}
            <div className="editorial-img-wrap" style={{
              position: 'absolute',
              bottom: '-8%',
              left: '-6%',
              width: 'clamp(150px, 50%, 260px)',
              height: 'clamp(140px, 26vw, 240px)',
              borderRadius: '12px',
              border: '4px solid #0A120E',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
              zIndex: 5
            }}>
              <img
                src="/Photo 2.webp"
                alt="Estate Sunset Atmosphere"
                loading="lazy"
                decoding="async"
                width="600"
                height="400"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HORIZONTAL GALLERY WITH PHOTO 3, PHOTO 4, PHOTO 5
          ========================================================================= */}
      <section style={{
        backgroundColor: '#0F1A14',
        padding: 'clamp(3.5rem, 6vw, 6rem) 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.74rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#C59B27', fontWeight: 700 }}>
                Estate Haven Visual Journal
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginTop: '0.4rem' }}>
                Architecture & Canopy Immersion
              </h2>
            </div>

            <span style={{ fontSize: '0.85rem', color: '#D8E8DF' }}>
              Original Estate Photography
            </span>
          </div>

          {/* 3-Card Visual Grid with Photo 3, Photo 4, Photo 5 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Card 1: Photo 3 */}
            <div style={{
              backgroundColor: '#14241C',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div className="editorial-img-wrap" style={{ height: 'clamp(220px, 30vw, 320px)' }}>
                <img
                  src="/Photo 3.webp"
                  alt="Plunge Pool Villa View"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="427"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.4rem' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#C59B27', fontWeight: 600 }}>
                  Signature Keys &bull; 12 Villas
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginTop: '0.4rem', marginBottom: '0.6rem' }}>
                  Private Heated Plunge Pool Villas
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#D8E8DF', lineHeight: 1.5, margin: 0 }}>
                  1,350 sq.ft secluded sanctuary with heated private pool and panoramic canopy views over the Western Ghats.
                </p>
              </div>
            </div>

            {/* Card 2: Photo 4 */}
            <div style={{
              backgroundColor: '#14241C',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div className="editorial-img-wrap" style={{ height: 'clamp(220px, 30vw, 320px)' }}>
                <img
                  src="/Photo 4.webp"
                  alt="Estate Valley Suites"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="427"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.4rem' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#C59B27', fontWeight: 600 }}>
                  Estate Suites &bull; 24 Keys
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginTop: '0.4rem', marginBottom: '0.6rem' }}>
                  Estate Valley Suites
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#D8E8DF', lineHeight: 1.5, margin: 0 }}>
                  680 sq.ft glass-walled suites cantilevered over coffee trees with deep terrazzo tubs and morning mist balconies.
                </p>
              </div>
            </div>

            {/* Card 3: Photo 5 */}
            <div style={{
              backgroundColor: '#14241C',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div className="editorial-img-wrap" style={{ height: 'clamp(220px, 30vw, 320px)' }}>
                <img
                  src="/Photo 5.webp"
                  alt="Planter's Cottage & Lawns"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="427"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.4rem' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#C59B27', fontWeight: 600 }}>
                  Heritage Living &bull; 28 Keys
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', marginTop: '0.4rem', marginBottom: '0.6rem' }}>
                  Plantation Classic & Bhadra Lawns
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#D8E8DF', lineHeight: 1.5, margin: 0 }}>
                  Teakwood colonial verandas and verdant open lawns framed by shade-grown coffee and silver oaks for unforgettable weddings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: SECOND RUNNING MARQUEE (REVERSE DIRECTION)
          ========================================================================= */}
      <section style={{
        overflow: 'hidden',
        backgroundColor: '#0A120E',
        padding: '1.2rem 0'
      }}>
        <div className="animate-marquee-right" style={{ gap: '2.5rem', alignItems: 'center' }}>
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#C59B27', fontWeight: 600 }}>
                Direct Booking Privilege: Promo Code DIRECT10
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <span style={{ fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#FAF8F5' }}>
                Save 20% OTA Commission
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <span style={{ fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#D8E8DF' }}>
                Complimentary Guided Harvest Safari & Tasting
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <span style={{ fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#FAF8F5' }}>
                Priority Villa Placement
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: WEDDINGS & CORPORATE OFFSITES IMMERSION
          ========================================================================= */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Destination Wedding Buyouts */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            minHeight: '440px',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2.5rem'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(to top, rgba(10,18,14,0.92) 20%, rgba(10,18,14,0.3) 100%), url("/Photo 2.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 5 }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.72rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#C59B27',
                fontWeight: 700,
                marginBottom: '0.6rem'
              }}>
                Bhadra Lawns &bull; 500 Guests
              </span>
              <h3 style={{ fontSize: '2rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.8rem' }}>
                Destination Weddings in the Mist
              </h3>
              <p style={{ color: '#E0EDE5', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Exclusive 76-key estate buyouts with authentic Malnad royal banqueting, Sangeet under silver oak canopies, and concierge coordination.
              </p>
              <button
                onClick={() => { setActivePage('weddings'); window.scrollTo(0, 0); }}
                className="btn-gold"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.85rem' }}
              >
                <span>Plan Your Wedding</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Corporate Offsites & Retreats */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            minHeight: '440px',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2.5rem'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(to top, rgba(10,18,14,0.92) 20%, rgba(10,18,14,0.3) 100%), url("/Photo 1.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 5 }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.72rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#C59B27',
                fontWeight: 700,
                marginBottom: '0.6rem'
              }}>
                The Planter's Pavilion &bull; 80 Pax
              </span>
              <h3 style={{ fontSize: '2rem', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginBottom: '0.8rem' }}>
                Leadership & Corporate Retreats
              </h3>
              <p style={{ color: '#E0EDE5', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                High-speed fiber connectivity, dedicated conference amphitheater, coffee trail networking challenges, and twilight outdoor barbecue banquets.
              </p>
              <button
                onClick={() => { setActivePage('offsites'); window.scrollTo(0, 0); }}
                className="btn-primary"
                style={{
                  backgroundColor: '#FAF8F5',
                  color: '#12261B',
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.85rem'
                }}
              >
                <span>Explore Offsite Packages</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: DIRECT BOOKING COMMITMENT & REVENUE PROTECTION
          ========================================================================= */}
      <section style={{
        backgroundColor: '#0F1A14',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.74rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#C59B27', fontWeight: 700 }}>
            Zero OTA Commissions &bull; Direct Value
          </span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#FFFFFF', fontFamily: 'var(--font-serif)', marginTop: '0.6rem', marginBottom: '1rem' }}>
            Book Directly With Company A
          </h2>
          <p style={{ color: '#D8E8DF', maxWidth: '640px', margin: '0 auto 2.5rem auto', fontSize: '0.98rem', lineHeight: 1.7 }}>
            By booking through our direct website, you enjoy our guaranteed lowest tariff, avoid online travel agency surcharges, and support sustainable shade-grown coffee farming in Chikkamagaluru.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1.2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => { setActivePage('rooms'); window.scrollTo(0, 0); }}
              className="btn-gold"
              style={{ padding: '0.9rem 2.2rem', fontSize: '0.95rem' }}
            >
              <span>View Available Dates & Villas</span>
              <ArrowRight size={16} />
            </button>

            <span style={{ fontSize: '0.82rem', color: '#D8E8DF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#C59B27" /> Hard Allotment Isolation &bull; Instant Confirmation
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
