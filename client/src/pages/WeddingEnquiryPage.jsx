import React, { useState } from 'react';
import { api } from '../services/api';
import { HeartHandshake, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WeddingEnquiryPage({ setActivePage }) {
  const [formData, setFormData] = useState({
    guestName: 'Meera Sen & Family',
    contact: 'meera.sen@outlook.com | +91 98201 55431',
    preferredDates: 'February 2027 (2 nights)',
    guestCount: '250 guests',
    lawnChoice: 'Bhadra Lawn (Up to 500 guests)',
    buyoutChoice: 'Exclusive 76-Key Full Estate Buyout',
    cateringType: 'Traditional Malnad Royal Banqueting + Multi-Cuisine',
    message: "Planning my sister's destination wedding in February 2027. Need accommodation for 250 guests across 2 nights, lawn for Sangeet & Pheras, and high-tea on the estate veranda."
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createEnquiry({
        channel: 'web',
        guestName: formData.guestName,
        contact: formData.contact,
        eventType: 'Wedding',
        guestCount: formData.guestCount,
        preferredDates: formData.preferredDates,
        budgetRange: `${formData.lawnChoice} + ${formData.buyoutChoice}`,
        message: formData.message
      });
      setSubmittedResult(res.enquiry);
    } catch (err) {
      alert('Failed to submit enquiry: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '3.5rem 1.5rem', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--coffee-accent)',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <HeartHandshake size={15} /> Bhadra Lawns &bull; 76 Keys Estate
        </span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '0.8rem' }}>
          Destination Weddings in Chikkamagaluru
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          Create timeless memories framed by sprawling coffee shrubs, 100-year-old silver oaks, and mountain mist. Dedicated event coordination with median response under 30 minutes.
        </p>
      </div>

      {!submittedResult ? (
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Organizer / Family Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Email & WhatsApp Mobile Number *
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Tentative Wedding Dates & Duration *
                </label>
                <input
                  type="text"
                  value={formData.preferredDates}
                  onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                  placeholder="e.g. February 2027 (2 nights)"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Expected Guest Count *
                </label>
                <input
                  type="text"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  placeholder="e.g. 250 guests"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Preferred Lawn / Venue
                </label>
                <select
                  value={formData.lawnChoice}
                  onChange={(e) => setFormData({ ...formData, lawnChoice: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                >
                  <option value="Bhadra Lawn (Up to 500 guests)">Bhadra Lawn (Up to 500 guests)</option>
                  <option value="Estate Canopy Grounds (Up to 250 guests)">Estate Canopy Grounds (Up to 250 guests)</option>
                  <option value="Planter's Ballroom & Lawn (Combined)">Planter's Ballroom & Lawn (Combined)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Accommodation Requirement
                </label>
                <select
                  value={formData.buyoutChoice}
                  onChange={(e) => setFormData({ ...formData, buyoutChoice: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                >
                  <option value="Exclusive 76-Key Full Estate Buyout">Exclusive 76-Key Full Estate Buyout (All Suites & Villas)</option>
                  <option value="Partial Buyout (40 to 50 rooms)">Partial Buyout (40 to 50 rooms)</option>
                  <option value="Only Lawn Venue & Banquet">Only Lawn Venue & Banquet (No Rooms)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Event Vision & Details
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold"
              style={{ padding: '0.9rem 1.8rem', fontSize: '1rem', justifyContent: 'center' }}
            >
              {submitting ? 'Submitting & AI Routing...' : 'Submit Wedding Enquiry & Generate AI Proposal'}
            </button>
          </form>
        </div>
      ) : (
        /* Submitted AI Routing Feedback Widget */
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', border: '2px solid var(--gold-warm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-warm)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span className="badge badge-gold">AI Router & CRM Active</span>
              <h2 style={{ fontSize: '1.45rem', marginTop: '0.2rem' }}>
                Enquiry {submittedResult.enquiry_code} Successfully Received & Routed
              </h2>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-muted)',
            borderRadius: '8px',
            padding: '1.2rem',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.88rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Classified Category:</span>
              <strong style={{ textTransform: 'capitalize', color: 'var(--primary-deep)' }}>
                {submittedResult.category.replace('_', ' ')} (98% Confidence)
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Assigned Lead:</span>
              <strong>{submittedResult.assigned_to} ({submittedResult.assigned_role})</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Extracted Entities:</span>
              <span>{submittedResult.extracted_guests} &bull; {submittedResult.extracted_dates}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} color="var(--gold-warm)" /> AI-Drafted Response Ready for Staff Review:
            </h4>
            <pre style={{
              backgroundColor: '#FAFAF8',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '1.2rem',
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)'
            }}>
              {submittedResult.draft_reply}
            </pre>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setActivePage('inbox');
                window.scrollTo(0, 0);
              }}
              className="btn-primary"
            >
              <span>View in AI Staff Inbox</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setSubmittedResult(null)}
              className="btn-secondary"
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

