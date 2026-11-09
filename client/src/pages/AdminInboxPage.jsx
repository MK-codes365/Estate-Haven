import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Inbox,
  AlertTriangle,
  Send,
  Sparkles,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  Filter,
  RefreshCw,
  Search,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function AdminInboxPage() {
  const { role, user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Filters
  const [currentLane, setCurrentLane] = useState('all'); // 'all', 'unsorted', 'escalated', 'wedding', 'corporate_offsite', 'room_booking'
  const [searchQuery, setSearchQuery] = useState('');

  // Editing draft state
  const [editedDraft, setEditedDraft] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  // Simulation Modal
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simChannel, setSimChannel] = useState('whatsapp');
  const [simSender, setSimSender] = useState('Deepak Singhania');
  const [simContact, setSimContact] = useState('+91 98451 99887');
  const [simMessage, setSimMessage] = useState('Looking for a villa for 3 nights in March for our 10th anniversary with private pool');
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, [currentLane]);

  async function fetchEnquiries() {
    setLoading(true);
    try {
      const params = {};
      if (currentLane === 'unsorted') {
        params.lane = 'unsorted';
      } else if (currentLane === 'escalated') {
        params.lane = 'escalated';
      } else if (currentLane !== 'all') {
        params.category = currentLane;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const res = await api.getEnquiries(params);
      setEnquiries(res.enquiries || []);
      setCounts(res.counts || {});

      // Keep selection or pick first
      if (res.enquiries && res.enquiries.length > 0) {
        const found = res.enquiries.find(e => selectedEnquiry && e.id === selectedEnquiry.id);
        const active = found || res.enquiries[0];
        setSelectedEnquiry(active);
        setEditedDraft(active.draft_reply || '');
      } else {
        setSelectedEnquiry(null);
        setEditedDraft('');
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectEnquiry = (enq) => {
    setSelectedEnquiry(enq);
    setEditedDraft(enq.draft_reply || '');
  };

  const handleSendReply = async () => {
    if (!selectedEnquiry) return;
    setSendingReply(true);
    try {
      const res = await api.sendReply(selectedEnquiry.id, editedDraft);
      setSuccessToast(`Reply sent successfully via simulated ${selectedEnquiry.channel.toUpperCase()} to ${selectedEnquiry.contact}!`);
      setTimeout(() => setSuccessToast(null), 5000);
      fetchEnquiries();
    } catch (err) {
      alert('Error sending reply: ' + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const handleCategoryReRoute = async (newCategory) => {
    if (!selectedEnquiry) return;
    try {
      let newOwner = selectedEnquiry.assigned_to;
      let newRole = selectedEnquiry.assigned_role;

      if (newCategory === 'wedding') {
        newOwner = 'Priya Sharma';
        newRole = 'Wedding & Events Lead';
      } else if (newCategory === 'corporate_offsite') {
        newOwner = 'Vikram Rao';
        newRole = 'Corporate Sales Lead';
      } else if (newCategory === 'room_booking') {
        newOwner = 'Ananya Joshi';
        newRole = 'Reservations Desk';
      } else if (newCategory === 'complaint') {
        newOwner = 'Rajesh Nair';
        newRole = 'General Manager';
      }

      await api.updateEnquiry(selectedEnquiry.id, {
        category: newCategory,
        assignedTo: newOwner,
        assignedRole: newRole
      });

      fetchEnquiries();
    } catch (err) {
      alert('Failed to re-route: ' + err.message);
    }
  };

  const handleSimulateInbound = async (e) => {
    e.preventDefault();
    setSimulating(true);
    try {
      const res = await api.createEnquiry({
        channel: simChannel,
        guestName: simSender,
        contact: simContact,
        message: simMessage
      });
      setSimModalOpen(false);
      fetchEnquiries();
      handleSelectEnquiry(res.enquiry);
    } catch (err) {
      alert('Simulation error: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '2.5rem 1.5rem', maxWidth: '1240px' }}>
      {/* Success Notification */}
      {successToast && (
        <div style={{
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success)',
          padding: '0.9rem 1.2rem',
          borderRadius: '8px',
          border: '1px solid #C3E6CB',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header & Simulator Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--coffee-accent)', fontWeight: 700 }}>
            Automated Lead & Guest CRM
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.2rem' }}>
            AI Enquiry Router & Unified Inbox
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Multi-channel ingestion (Web, WhatsApp, Email). Automated intent classification, entity extraction, grounded rate table quoting, and fail-safe human review.
          </p>
        </div>

        <button
          onClick={() => setSimModalOpen(true)}
          className="btn-gold"
          style={{ padding: '0.75rem 1.2rem', fontSize: '0.9rem' }}
        >
          <MessageSquare size={16} />
          <span>+ Simulate Inbound Message</span>
        </button>
      </div>

      {/* GM High-Priority Complaint Alert Banner */}
      {counts.complaints > 0 && (
        <div style={{
          backgroundColor: '#FDEDEC',
          border: '1.5px solid #E74C3C',
          borderRadius: '8px',
          padding: '1rem 1.4rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShieldAlert size={24} color="#C0392B" className="pulse-alert" />
            <div>
              <strong style={{ color: '#C0392B', fontSize: '0.98rem' }}>
                CRITICAL GM ESCALATION ACTIVE: {counts.complaints} In-House Guest Complaint(s)
              </strong>
              <p style={{ fontSize: '0.85rem', color: '#78281F', marginTop: '0.1rem' }}>
                Guest dissatisfaction automatically bypassed normal queue and assigned directly to GM Rajesh Nair.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentLane('escalated')}
            className="btn-primary"
            style={{ backgroundColor: '#C0392B', fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
          >
            Review Complaints Lane
          </button>
        </div>
      )}

      {/* Filter Tabs / Lanes */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.8rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        {[
          { id: 'all', label: 'All Enquiries', count: counts.total || 0 },
          { id: 'wedding', label: 'Weddings (Priya)', count: counts.weddings || 0 },
          { id: 'corporate_offsite', label: 'Offsites (Vikram)', count: counts.offsites || 0 },
          { id: 'room_booking', label: 'Room Bookings (Ananya)', count: counts.roomBookings || 0 },
          { id: 'unsorted', label: 'Unsorted Lane (<70% Conf)', count: counts.unsorted || 0, badgeStyle: 'badge-warning' },
          { id: 'escalated', label: 'GM Complaints', count: counts.complaints || 0, badgeStyle: 'badge-danger' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentLane(tab.id)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: currentLane === tab.id ? 700 : 500,
              backgroundColor: currentLane === tab.id ? 'var(--primary-deep)' : '#FFFFFF',
              color: currentLane === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '999px',
              backgroundColor: currentLane === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-muted)',
              color: currentLane === tab.id ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 700
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Inbox Workspace (Split View: List & Detail/Editor) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Enquiries List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search code, guest or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries()}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.8rem 0.5rem 2.2rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <button onClick={fetchEnquiries} className="btn-secondary" style={{ padding: '0.5rem' }}>
              <RefreshCw size={15} />
            </button>
          </div>

          <div style={{ maxHeight: '680px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading inbox messages...
              </div>
            ) : enquiries.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No enquiries found in this lane.
              </div>
            ) : (
              enquiries.map(enq => {
                const isSelected = selectedEnquiry && selectedEnquiry.id === enq.id;
                const isComplaint = enq.category === 'complaint' || enq.is_escalated_gm === 1;
                const isLowConf = enq.confidence < 0.70 || enq.category === 'unsorted';

                return (
                  <div
                    key={enq.id}
                    onClick={() => handleSelectEnquiry(enq)}
                    style={{
                      padding: '1.2rem',
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--primary-subtle)' : (isComplaint ? '#FDF5F5' : '#FFFFFF'),
                      borderLeft: isSelected ? '4px solid var(--primary-deep)' : (isComplaint ? '4px solid #C0392B' : '4px solid transparent'),
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-deep)' }}>
                          {enq.enquiry_code}
                        </span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.72rem',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-muted)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px'
                        }}>
                          {enq.channel === 'whatsapp' ? <Phone size={11} color="#25D366" /> : (enq.channel === 'email' ? <Mail size={11} color="#3498DB" /> : <Globe size={11} color="var(--primary-forest)" />)}
                          {enq.channel}
                        </span>
                      </div>

                      {isComplaint ? (
                        <span className="badge badge-danger">GM Alert</span>
                      ) : isLowConf ? (
                        <span className="badge badge-warning">Unsorted</span>
                      ) : (
                        <span className="badge badge-primary">{Math.round(enq.confidence * 100)}% Match</span>
                      )}
                    </div>

                    <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--primary-deep)', marginBottom: '0.2rem' }}>
                      {enq.guest_name}
                    </strong>

                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: '0.6rem'
                    }}>
                      "{enq.message}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Owner: <strong>{enq.assigned_to}</strong></span>
                      <span style={{
                        color: enq.status === 'replied' ? '#1E8449' : '#D35400',
                        fontWeight: 600
                      }}>
                        {enq.status === 'replied' ? '✓ Replied' : '● Draft Ready'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis, Rate Grounding & Draft Review Workspace */}
        {selectedEnquiry ? (
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
            {/* Header with channel and code */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '1.2rem',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.8rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>{selectedEnquiry.enquiry_code}</h2>
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                    {selectedEnquiry.category.replace('_', ' ')}
                  </span>
                  {selectedEnquiry.is_escalated_gm === 1 && (
                    <span className="badge badge-danger">High Priority GM Escalation</span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  From: <strong>{selectedEnquiry.guest_name}</strong> &bull; {selectedEnquiry.contact}
                </span>
              </div>

              {/* One-Click Staff Re-Routing Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                  Staff Re-Route Lane:
                </label>
                <select
                  value={selectedEnquiry.category}
                  onChange={(e) => handleCategoryReRoute(e.target.value)}
                  style={{
                    padding: '0.4rem 0.6rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-muted)'
                  }}
                >
                  <option value="room_booking">Room Booking (Ananya Joshi)</option>
                  <option value="wedding">Destination Wedding (Priya Sharma)</option>
                  <option value="corporate_offsite">Corporate Offsite (Vikram Rao)</option>
                  <option value="complaint">Complaint (Rajesh Nair, GM)</option>
                  <option value="unsorted">Unsorted Lane (GM Review)</option>
                </select>
              </div>
            </div>

            {/* Inbound Message Box */}
            <div style={{
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '1.2rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Inbound Guest Message (Channel: {selectedEnquiry.channel.toUpperCase()})
              </span>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{selectedEnquiry.message}"
              </p>
            </div>

            {/* AI Entity Extractor & Rate Table Grounding Badge */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--primary-subtle)',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Extracted Dates / Season:</span>
                <strong style={{ color: 'var(--primary-deep)' }}>{selectedEnquiry.extracted_dates || 'Pending'}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Extracted Pax / Guests:</span>
                <strong style={{ color: 'var(--primary-deep)' }}>{selectedEnquiry.extracted_guests || 'Pending'}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Rate Table Grounding:</span>
                <strong style={{ color: 'var(--primary-deep)' }}>
                  {selectedEnquiry.category === 'room_booking' ? 'Live DB Rates Applied' : 'Event Tariff Catalog'}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Assigned Owner:</span>
                <strong style={{ color: 'var(--primary-deep)' }}>
                  {selectedEnquiry.assigned_to} ({selectedEnquiry.assigned_role})
                </strong>
              </div>
            </div>

            {/* AI Draft Review & Edit Area */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--primary-deep)'
                }}>
                  <Sparkles size={14} color="var(--gold-warm)" />
                  AI Generated Draft Reply (Staff Review Required)
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary-deep)',
                  fontWeight: 600
                }}>
                  Live AI Engine Active &bull; Zero Auto-Send Guardrail
                </span>
              </div>

              <textarea
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                rows={9}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Action Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '1.2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target Dispatch: Simulated {selectedEnquiry.channel.toUpperCase()} to {selectedEnquiry.contact}
              </span>

              <button
                onClick={handleSendReply}
                disabled={sendingReply}
                className="btn-primary"
                style={{ padding: '0.75rem 1.6rem' }}
              >
                <Send size={15} />
                <span>
                  {sendingReply ? 'Dispatching...' : `Approve & Send via ${selectedEnquiry.channel.toUpperCase()}`}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Select an enquiry from the list to review the AI analysis and reply draft.
          </div>
        )}
      </div>

      {/* Simulator Modal */}
      {simModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1.5rem'
        }}>
          <div className="card animate-fade" style={{ maxWidth: '580px', width: '100%', backgroundColor: '#FFFFFF', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
              Simulate Inbound Message
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Test how the AI Enquiry Router classifies messages, extracts dates and guests, and drafts responses.
            </p>

            {/* Preset quick buttons */}
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Quick Test Presets (From Brief):
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('web');
                    setSimSender('Pooja Hedge');
                    setSimMessage("Venue for my sister's wedding in Feb 2027, about 250 guests, 2 nights");
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                >
                  ENQ-4410 (Wedding)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('whatsapp');
                    setSimSender('Karthik Subbaraj');
                    setSimMessage('Is a villa free 14-16 Nov for 2 adults and a child?');
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                >
                  ENQ-4411 (Room Booking)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('email');
                    setSimSender('Naveen HR Tech');
                    setSimMessage('Team of 45 wants a January offsite with a conference hall');
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                >
                  ENQ-4412 (Corporate)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('whatsapp');
                    setSimSender('In-House Guest (Villa 2)');
                    setSimMessage('Air conditioning in Villa 2 is leaking water and smelling bad! Front desk did not attend for 30 minutes.');
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: '#FDF0ED', color: '#C0392B', borderRadius: '4px', border: '1px solid #E0B4B4' }}
                >
                  Complaint (GM Alert)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('web');
                    setSimSender('Visitor');
                    setSimMessage('Hello, just wanted to know if you exist');
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: '#FEF9E7', color: '#B7950B', borderRadius: '4px', border: '1px solid #F9E79F' }}
                >
                  Ambiguous (Unsorted Lane)
                </button>
              </div>
            </div>

            <form onSubmit={handleSimulateInbound} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>Channel</label>
                  <select
                    value={simChannel}
                    onChange={(e) => setSimChannel(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  >
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="email">Forwarded Email</option>
                    <option value="web">Web Enquiry Form</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>Sender Name</label>
                  <input
                    type="text"
                    value={simSender}
                    onChange={(e) => setSimSender(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>Contact Info</label>
                <input
                  type="text"
                  value={simContact}
                  onChange={(e) => setSimContact(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>Inbound Message Text</label>
                <textarea
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSimModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simulating}
                  className="btn-primary"
                >
                  {simulating ? 'Processing AI...' : 'Inject Message & Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

