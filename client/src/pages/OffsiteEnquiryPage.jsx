import React, { useState } from 'react';
import { api } from '../services/api';
import { Briefcase, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function OffsiteEnquiryPage({ setActivePage }) {
  const [formData, setFormData] = useState({
    guestName: 'Siddharth Menon (VP HR, RazorTech)',
    contact: 'siddharth.m@razortech.io | +91 98450 67812',
    preferredDates: 'January 2027 (3 days)',
    guestCount: '45 delegates',
    facilityNeeded: "The Planter's Conference Pavilion (80 Pax) + AV & High-Speed Fiber",
    activityPreference: 'Coffee Harvest Trail + Outdoor Bonfire Barbecue',
    message: 'Team of 45 wants a January offsite with a conference hall. Need 23 twin-sharing suites, high-speed fiber for workshops, and outdoor team-building activities.'
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
        eventType: 'Corporate Offsite',
        guestCount: formData.guestCount,
        preferredDates: formData.preferredDates,
        budgetRange: `${formData.facilityNeeded} + ${formData.activityPreference}`,
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
          color: 'var(--primary-forest)',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <Briefcase size={15} /> The Planter’s Conference Pavilion
        </span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '0.8rem' }}>
          Leadership & Corporate Offsites
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          High-performance strategy meets deep coffee estate tranquility. State-of-the-art 4K conference hall, outdoor breakaway terraces, and curated team challenges.
        </p>
      </div>

      {!submittedResult ? (
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Company Name & Lead Organizer *
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
                  Official Email & Mobile *
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
                  Tentative Month / Dates *
                </label>
                <input
                  type="text"
                  value={formData.preferredDates}
                  onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                  placeholder="e.g. January 2027 (3 days)"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Total Delegate Count *
                </label>
                <input
                  type="text"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  placeholder="e.g. 45 delegates"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Conference & Technical Facilities
                </label>
                <select
                  value={formData.facilityNeeded}
                  onChange={(e) => setFormData({ ...formData, facilityNeeded: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                >
                  <option value="The Planter's Conference Pavilion (80 Pax) + AV & High-Speed Fiber">The Planter's Conference Pavilion (80 Pax) + 4K AV & Dual Fiber</option>
                  <option value="Executive Boardroom (25 Pax) with Video Conferencing">Executive Boardroom (25 Pax) with Video Conferencing</option>
                  <option value="Open-Air Plantation Amphitheater">Open-Air Plantation Amphitheater</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Team Building Activities
                </label>
                <select
                  value={formData.activityPreference}
                  onChange={(e) => setFormData({ ...formData, activityPreference: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                >
                  <option value="Coffee Harvest Trail + Outdoor Bonfire Barbecue">Coffee Harvest Trail + Outdoor Bonfire Barbecue</option>
                  <option value="Western Ghats Peak Trek + Survival Challenge">Western Ghats Peak Trek + Survival Challenge</option>
                  <option value="Estate Scavenger Hunt & Cocktail Evening">Estate Scavenger Hunt & Cocktail Evening</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Offsite Objectives & Room Preferences
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
              className="btn-primary"
              style={{ padding: '0.9rem 1.8rem', fontSize: '1rem', justifyContent: 'center' }}
            >
              {submitting ? 'Routing to Corporate Lead...' : 'Submit Corporate Offsite Enquiry'}
            </button>
          </form>
        </div>
      ) : (
        /* Submitted Feedback */
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', border: '2px solid var(--primary-deep)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-deep)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span className="badge badge-primary">Corporate Sales Lead Assigned</span>
              <h2 style={{ fontSize: '1.45rem', marginTop: '0.2rem' }}>
                Enquiry {submittedResult.enquiry_code} Routed to Vikram Rao
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
              <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Category & Confidence:</span>
              <strong style={{ color: 'var(--primary-deep)' }}>
                Corporate Offsite (96% Confidence)
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
              <Sparkles size={15} color="var(--primary-forest)" /> AI-Drafted Response Ready for Corporate Desk:
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
              Submit Another Corporate Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
