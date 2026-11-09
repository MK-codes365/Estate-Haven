import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Send,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  RefreshCw,
  Search,
  MessageSquare,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCheck,
  Building2,
  Calendar,
  Users,
  CreditCard
} from 'lucide-react';

export default function AdminInboxPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Filters & Lanes
  const [currentLane, setCurrentLane] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing draft state
  const [editedDraft, setEditedDraft] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const [isFollowUpMode, setIsFollowUpMode] = useState(false);

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
      } else if (currentLane === 'replied') {
        params.status = 'replied';
      } else if (currentLane !== 'all') {
        params.category = currentLane;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const res = await api.getEnquiries(params);
      const list = res.enquiries || [];
      setEnquiries(list);
      setCounts(res.counts || {});

      // Keep current selection or pick first item
      if (list.length > 0) {
        const found = list.find(e => selectedEnquiry && e.id === selectedEnquiry.id);
        const active = found || list[0];
        setSelectedEnquiry(active);
        setEditedDraft(active.sent_reply || active.draft_reply || '');
        setIsFollowUpMode(false);
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
    setEditedDraft(enq.sent_reply || enq.draft_reply || '');
    setIsFollowUpMode(false);
  };

  const handleSendReply = async () => {
    if (!selectedEnquiry) return;
    setSendingReply(true);
    try {
      const res = await api.sendReply(selectedEnquiry.id, editedDraft);
      
      // Update local selected record immediately with delivered state
      const updatedEnquiry = res.enquiry || {
        ...selectedEnquiry,
        status: 'replied',
        sent_reply: editedDraft,
        replied_at: res.sentAt || new Date().toISOString()
      };
      
      setSelectedEnquiry(updatedEnquiry);
      setIsFollowUpMode(false);

      // Show luxury confirmation banner
      setSuccessToast(`Dispatched successfully via simulated ${selectedEnquiry.channel.toUpperCase()} to ${selectedEnquiry.contact}!`);
      setTimeout(() => setSuccessToast(null), 6000);

      // Refresh background counters & list
      const fresh = await api.getEnquiries(currentLane === 'all' ? {} : { category: currentLane });
      if (fresh.enquiries) {
        setEnquiries(fresh.enquiries);
        setCounts(fresh.counts || {});
      }
    } catch (err) {
      alert('Error dispatching reply: ' + err.message);
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
        newRole = 'Wedding & Banquets Lead';
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

      const res = await api.updateEnquiry(selectedEnquiry.id, {
        category: newCategory,
        assignedTo: newOwner,
        assignedRole: newRole
      });

      if (res.enquiry) {
        setSelectedEnquiry(res.enquiry);
      }
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
      await fetchEnquiries();
      if (res.enquiry) {
        handleSelectEnquiry(res.enquiry);
      }
    } catch (err) {
      alert('Simulation error: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return dateStr;
    }
  };

  const isComplaint = selectedEnquiry && (selectedEnquiry.category === 'complaint' || selectedEnquiry.is_escalated_gm === 1);
  const isReplied = selectedEnquiry && selectedEnquiry.status === 'replied';

  return (
    <div className="container animate-fade" style={{ padding: '2.5rem 1.5rem', maxWidth: '1280px' }}>
      
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          backgroundColor: '#E8F5E9',
          color: '#1B5E20',
          padding: '1rem 1.4rem',
          borderRadius: '8px',
          border: '1.5px solid #81C784',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(27,94,32,0.1)'
        }}>
          <CheckCircle2 size={20} color="#2E7D32" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Luxury Operations Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E6E1D8',
        borderRadius: '12px',
        padding: '1.8rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderBottom: '1px solid #EFEAE2',
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '1.8px', textTransform: 'uppercase', color: 'var(--coffee-accent)', fontWeight: 700 }}>
                The Serai Ridge Estate & Resort &bull; Chikkamagaluru
              </span>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#EFEAE2', color: 'var(--primary-deep)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                76 Keys Matrix
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', margin: '0.2rem 0', color: 'var(--primary-deep)', fontFamily: 'var(--font-serif)' }}>
              General Manager's Communications & Lead Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '780px', lineHeight: 1.5 }}>
              Omnichannel lead management across WhatsApp, forwarded emails, and direct website forms. Grounded rate table quoting, strict allotment protection, and instant human review.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={() => setSimModalOpen(true)}
              className="btn-gold"
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MessageSquare size={16} />
              <span>+ Simulate Inbound Lead</span>
            </button>
          </div>
        </div>

        {/* Operational KPI Ribbon (From Business Case Numbers) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.2rem'
        }}>
          <div style={{ padding: '0.8rem 1rem', backgroundColor: '#FAF8F5', borderRadius: '8px', border: '1px solid #EFEAE2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Clock size={13} color="var(--primary-forest)" />
              <span>Median Reply Time</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: '0.2rem' }}>
              14 mins <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600 }}>(SLA &lt; 30m)</span>
            </div>
          </div>

          <div style={{ padding: '0.8rem 1rem', backgroundColor: '#FAF8F5', borderRadius: '8px', border: '1px solid #EFEAE2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <CreditCard size={13} color="var(--gold-warm)" />
              <span>OTA Leakage Target</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: '0.2rem' }}>
              ₹33.3 Lakhs <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>(15% shift)</span>
            </div>
          </div>

          <div style={{ padding: '0.8rem 1rem', backgroundColor: '#FAF8F5', borderRadius: '8px', border: '1px solid #EFEAE2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Building2 size={13} color="#2563EB" />
              <span>Event Loss Guard</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: '0.2rem' }}>
              ₹72 Lakhs <span style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600 }}>(36 events/yr)</span>
            </div>
          </div>

          <div style={{ padding: '0.8rem 1rem', backgroundColor: '#FAF8F5', borderRadius: '8px', border: '1px solid #EFEAE2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <UserCheck size={13} color="#C0392B" />
              <span>Duty Manager Desk</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-deep)', marginTop: '0.4rem' }}>
              Rajesh Nair <span style={{ fontSize: '0.78rem', color: '#666', fontWeight: 500 }}>(General Manager)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical GM Complaint Alert Banner (If Any Unresolved In-House Complaints) */}
      {counts.complaints > 0 && (
        <div style={{
          backgroundColor: '#FDF2F2',
          border: '1.5px solid #E57373',
          borderRadius: '10px',
          padding: '1.1rem 1.6rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(192,57,43,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FFEBEE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #FFCDD2'
            }}>
              <ShieldAlert size={22} color="#C0392B" />
            </div>
            <div>
              <strong style={{ color: '#C0392B', fontSize: '1.05rem', display: 'block' }}>
                Priority Resolution: {counts.complaints} In-House Guest Dissatisfaction Alert
              </strong>
              <p style={{ fontSize: '0.86rem', color: '#5D100C', marginTop: '0.1rem' }}>
                Bypassed standard queue. Assigned directly to General Manager Rajesh Nair for 15-minute resolution protocol.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentLane('escalated')}
            style={{
              backgroundColor: '#C0392B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.84rem',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer'
            }}
          >
            Review Escalation Desk &rarr;
          </button>
        </div>
      )}

      {/* Omnichannel Operational Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.8rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #E6E1D8'
      }}>
        {[
          { id: 'all', label: 'All Inbound Leads', count: counts.total || 0 },
          { id: 'wedding', label: 'Weddings & Banquets (Priya)', count: counts.weddings || 0 },
          { id: 'corporate_offsite', label: 'Corporate Offsites (Vikram)', count: counts.offsites || 0 },
          { id: 'room_booking', label: 'Room Reservations (Ananya)', count: counts.roomBookings || 0 },
          { id: 'unsorted', label: 'Unsorted Queue (<70% Match)', count: counts.unsorted || 0, isWarn: true },
          { id: 'escalated', label: 'GM Escalations / Complaints', count: counts.complaints || 0, isCrit: true },
          { id: 'replied', label: 'Dispatched & Resolved', count: (counts.total || 0) - (counts.pending || 0) }
        ].map(tab => {
          const isActive = currentLane === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentLane(tab.id)}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--primary-deep)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--primary-deep)' : '1px solid #E6E1D8',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.72rem',
                padding: '0.12rem 0.5rem',
                borderRadius: '999px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : (tab.isCrit ? '#FEE2E2' : (tab.isWarn ? '#FEF3C7' : '#F3EFEA')),
                color: isActive ? '#FFFFFF' : (tab.isCrit ? '#B91C1C' : (tab.isWarn ? '#B45309' : 'var(--text-primary)')),
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Inbox Workspace (Split View) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 420px) 1fr',
        gap: '1.8rem',
        alignItems: 'start'
      }}>

        {/* LEFT COLUMN: Communications List */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E6E1D8',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          {/* Search bar */}
          <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid #EFEAE2', display: 'flex', gap: '0.5rem', backgroundColor: '#FAF8F5' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: '#888' }} />
              <input
                type="text"
                placeholder="Search reference, guest or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries()}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem 0.55rem 2.2rem',
                  border: '1px solid #E0DAD0',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>
            <button
              onClick={fetchEnquiries}
              title="Refresh Queue"
              style={{
                padding: '0.55rem 0.8rem',
                border: '1px solid #E0DAD0',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} color="#555" />
            </button>
          </div>

          {/* List items */}
          <div style={{ maxHeight: '720px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Loading communication records...
              </div>
            ) : enquiries.length === 0 ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No active records in this lane.
              </div>
            ) : (
              enquiries.map(enq => {
                const isSelected = selectedEnquiry && selectedEnquiry.id === enq.id;
                const isEnqComplaint = enq.category === 'complaint' || enq.is_escalated_gm === 1;
                const isDispatched = enq.status === 'replied';

                return (
                  <div
                    key={enq.id}
                    onClick={() => handleSelectEnquiry(enq)}
                    style={{
                      padding: '1.1rem 1.2rem',
                      borderBottom: '1px solid #EFEAE2',
                      backgroundColor: isSelected ? '#F5EFEB' : (isEnqComplaint && !isDispatched ? '#FDF5F5' : '#FFFFFF'),
                      borderLeft: isSelected ? '4px solid var(--primary-forest)' : (isEnqComplaint && !isDispatched ? '4px solid #C0392B' : '4px solid transparent'),
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* Top line: Reference + Channel + Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--primary-deep)', fontFamily: 'monospace' }}>
                          {enq.enquiry_code}
                        </span>
                        
                        {/* Channel Badge */}
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: enq.channel === 'whatsapp' ? '#E8F5E9' : (enq.channel === 'email' ? '#EFF6FF' : '#F5EFEB'),
                          color: enq.channel === 'whatsapp' ? '#1B5E20' : (enq.channel === 'email' ? '#1E40AF' : 'var(--primary-forest)')
                        }}>
                          {enq.channel === 'whatsapp' && <Phone size={10} color="#25D366" />}
                          {enq.channel === 'email' && <Mail size={10} color="#2563EB" />}
                          {enq.channel === 'web' && <Globe size={10} color="var(--primary-forest)" />}
                          {enq.channel.toUpperCase()}
                        </span>
                      </div>

                      {/* Status / Category indicator */}
                      {isDispatched ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: '#2E7D32', fontWeight: 700, backgroundColor: '#E8F5E9', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          <CheckCheck size={11} color="#2E7D32" /> Dispatched
                        </span>
                      ) : isEnqComplaint ? (
                        <span style={{ fontSize: '0.7rem', color: '#C0392B', fontWeight: 700, backgroundColor: '#FDEDEC', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          GM Escalation
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 700, backgroundColor: '#FEF3C7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          Action Required
                        </span>
                      )}
                    </div>

                    {/* Guest Name */}
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--primary-deep)', marginBottom: '0.2rem' }}>
                      {enq.guest_name}
                    </div>

                    {/* Excerpt */}
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      margin: '0 0 0.5rem 0'
                    }}>
                      "{enq.message}"
                    </p>

                    {/* Footer: Assigned Owner & Target */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#777' }}>
                      <span>Desk: <strong style={{ color: 'var(--primary-deep)' }}>{enq.assigned_to}</strong></span>
                      <span style={{ textTransform: 'capitalize' }}>{enq.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Executive Dossier & Dispatch Workspace */}
        {selectedEnquiry ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E6E1D8',
            borderRadius: '10px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>

            {/* Dossier Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid #EFEAE2',
              paddingBottom: '1.4rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'monospace', color: 'var(--primary-deep)' }}>
                    {selectedEnquiry.enquiry_code}
                  </h2>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    backgroundColor: isReplied ? '#E8F5E9' : (isComplaint ? '#FDEDEC' : '#EFF6FF'),
                    color: isReplied ? '#1B5E20' : (isComplaint ? '#C0392B' : '#1E40AF')
                  }}>
                    {isReplied ? '✓ Dispatched & Delivered' : (isComplaint ? 'High Priority GM Escalation' : 'Review & Dispatch Pending')}
                  </span>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Guest: <strong style={{ color: 'var(--primary-deep)' }}>{selectedEnquiry.guest_name}</strong> &bull; {selectedEnquiry.contact}
                </div>
              </div>

              {/* Staff Re-Route Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Department Lead Re-Routing:
                </label>
                <select
                  value={selectedEnquiry.category}
                  onChange={(e) => handleCategoryReRoute(e.target.value)}
                  style={{
                    padding: '0.45rem 0.8rem',
                    border: '1px solid #D5CEBF',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    backgroundColor: '#FAF8F5',
                    color: 'var(--primary-deep)'
                  }}
                >
                  <option value="room_booking">Room Reservations Desk (Ananya Joshi)</option>
                  <option value="wedding">Weddings & Celebrations (Priya Sharma)</option>
                  <option value="corporate_offsite">Corporate Offsites (Vikram Rao)</option>
                  <option value="complaint">GM Executive Escalation (Rajesh Nair)</option>
                  <option value="unsorted">Unsorted Queue (GM Review)</option>
                </select>
              </div>
            </div>

            {/* Special GM Escalation Action Strip for Complaints */}
            {isComplaint && (
              <div style={{
                backgroundColor: '#FDF2F2',
                border: '1.5px solid #FFCDD2',
                borderRadius: '8px',
                padding: '1.2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <strong style={{ color: '#C0392B', fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldAlert size={16} color="#C0392B" />
                    Duty Manager Action Required: In-House Guest Dissatisfaction
                  </strong>
                  <p style={{ fontSize: '0.82rem', color: '#6A1A17', margin: '0.2rem 0 0 0' }}>
                    Standard SLA: Immediate phone call or in-person villa visit by Rajesh Nair.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <a
                    href={`tel:${selectedEnquiry.contact.replace(/[^0-9+]/g, '')}`}
                    className="btn-primary"
                    style={{ backgroundColor: '#C0392B', fontSize: '0.78rem', padding: '0.45rem 0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Phone size={13} />
                    <span>Call Guest Directly</span>
                  </a>
                  <button
                    onClick={() => {
                      alert(`Duty Manager and Chief Engineer dispatched to inspect ${selectedEnquiry.guest_name}'s suite.`);
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #FFCDD2',
                      color: '#C0392B',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '0.45rem 0.8rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Dispatch Engineer
                  </button>
                </div>
              </div>
            )}

            {/* Stay Parameters & Rate Table Grounding Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1.1rem',
              backgroundColor: '#FAF8F5',
              border: '1px solid #EFEAE2',
              borderRadius: '8px',
              marginBottom: '1.8rem',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: '#777', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <Calendar size={13} /> Stay Dates / Season:
                </span>
                <strong style={{ color: 'var(--primary-deep)', fontSize: '0.88rem' }}>
                  {selectedEnquiry.extracted_dates || 'Under Consultation'}
                </strong>
              </div>

              <div>
                <span style={{ color: '#777', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <Users size={13} /> Guest Configuration:
                </span>
                <strong style={{ color: 'var(--primary-deep)', fontSize: '0.88rem' }}>
                  {selectedEnquiry.extracted_guests || 'Standard Party'}
                </strong>
              </div>

              <div>
                <span style={{ color: '#777', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <CreditCard size={13} /> Rate Matrix Grounding:
                </span>
                <strong style={{ color: '#1B5E20', fontSize: '0.88rem' }}>
                  Live DB Rates Grounded
                </strong>
              </div>

              <div>
                <span style={{ color: '#777', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                  <UserCheck size={13} /> Dossier Handler:
                </span>
                <strong style={{ color: 'var(--primary-deep)', fontSize: '0.88rem' }}>
                  {selectedEnquiry.assigned_to}
                </strong>
              </div>
            </div>

            {/* Inbound Guest Message Window */}
            <div style={{ marginBottom: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-secondary)' }}>
                  Inbound Transmission ({selectedEnquiry.channel.toUpperCase()})
                </span>
                <span style={{ fontSize: '0.72rem', color: '#888' }}>
                  Channel: <strong>{selectedEnquiry.channel.toUpperCase()} Gateway</strong>
                </span>
              </div>

              {/* Realistic Chat / Message Bubble */}
              <div style={{
                backgroundColor: selectedEnquiry.channel === 'whatsapp' ? '#ECE5DD' : '#F8FAFC',
                border: '1px solid #E2DCCF',
                borderRadius: '8px',
                padding: '1.2rem',
                position: 'relative'
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '1rem 1.2rem',
                  maxWidth: '85%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  borderLeft: '4px solid var(--primary-forest)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--primary-deep)' }}>
                      {selectedEnquiry.guest_name}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>
                      {formatDateTime(selectedEnquiry.created_at) || '10:42 AM'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#2C3E50', lineHeight: 1.5 }}>
                    "{selectedEnquiry.message}"
                  </p>
                </div>
              </div>
            </div>

            {/* CHANNEL OUTBOUND RESPONSE SECTION */}
            {isReplied && !isFollowUpMode ? (
              /* ALREADY DISPATCHED STATE: Authentic Verified Delivery View */
              <div style={{
                backgroundColor: '#F8FAF7',
                border: '1.5px solid #A5D6A7',
                borderRadius: '10px',
                padding: '1.6rem',
                marginBottom: '1rem'
              }}>
                {/* Delivery Confirmation Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                  marginBottom: '1.2rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #C8E6C9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#2E7D32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      <CheckCheck size={18} />
                    </div>
                    <div>
                      <strong style={{ color: '#1B5E20', fontSize: '0.96rem', display: 'block' }}>
                        Simulated {selectedEnquiry.channel.toUpperCase()} Transmission Delivered
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#2E7D32' }}>
                        Delivered to {selectedEnquiry.contact} &bull; Handled by {selectedEnquiry.assigned_to}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.76rem', color: '#555', backgroundColor: '#E8F5E9', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                    Status: Closed &bull; {formatDateTime(selectedEnquiry.replied_at)}
                  </span>
                </div>

                {/* Dispatched WhatsApp / Email bubble view */}
                <div style={{
                  backgroundColor: selectedEnquiry.channel === 'whatsapp' ? '#ECE5DD' : '#FFFFFF',
                  border: '1px solid #D5CEBF',
                  borderRadius: '8px',
                  padding: '1.4rem',
                  marginBottom: '1.2rem'
                }}>
                  <div style={{
                    backgroundColor: selectedEnquiry.channel === 'whatsapp' ? '#D9FDD3' : '#F8FAFC',
                    borderRadius: '8px',
                    padding: '1rem 1.2rem',
                    marginLeft: 'auto',
                    maxWidth: '90%',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    border: '1px solid #B2DFDB'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B5E20' }}>
                        The Serai Ridge &bull; Official Response
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#555' }}>
                        <span>{formatDateTime(selectedEnquiry.replied_at) || 'Just now'}</span>
                        <CheckCheck size={14} color="#0284C7" />
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1C2833', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {selectedEnquiry.sent_reply || selectedEnquiry.draft_reply}
                    </div>
                  </div>
                </div>

                {/* Post-Dispatch Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#666' }}>
                    Need to provide additional information to this guest?
                  </span>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      onClick={() => {
                        setEditedDraft(`Dear ${selectedEnquiry.guest_name},\n\nFollowing up on our earlier communication regarding your stay at Serai Ridge...`);
                        setIsFollowUpMode(true);
                      }}
                      className="btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                    >
                      + Send Follow-Up Message
                    </button>
                    <button
                      onClick={() => alert(`Direct booking reservation link generated and copied to clipboard for ${selectedEnquiry.guest_name}`)}
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}
                    >
                      Copy Direct Booking Link
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* PENDING DRAFT / COMPOSER STATE: Staff Review & Send */
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--primary-deep)',
                      letterSpacing: '0.5px'
                    }}>
                      Proposed Executive Reply (Staff Verification Required)
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#777', marginTop: '0.1rem' }}>
                      Tariffs derived directly from database rate tables. No autonomous transmission.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditedDraft(prev => prev + '\n\nPS: We would be delighted to include a complimentary guided plantation coffee walk and tasting during your stay.');
                      }}
                      style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem', backgroundColor: '#FAF8F5', border: '1px solid #D5CEBF', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      + Add Coffee Tasting
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditedDraft(prev => prev + '\n\nKindly note: As per Government regulations, foreign nationals must present passports at check-in for Form C documentation.');
                      }}
                      style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem', backgroundColor: '#FAF8F5', border: '1px solid #D5CEBF', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      + Form C Note
                    </button>
                  </div>
                </div>

                {/* Editable Reply Box */}
                <textarea
                  value={editedDraft}
                  onChange={(e) => setEditedDraft(e.target.value)}
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    border: '1.5px solid #D5CEBF',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: '#2C3E50',
                    backgroundColor: '#FFFFFF',
                    resize: 'vertical'
                  }}
                />

                {/* Dispatch Action Bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #EFEAE2',
                  paddingTop: '1.2rem',
                  marginTop: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '0.82rem', color: '#666' }}>
                    Simulated Gateway: <strong style={{ color: 'var(--primary-deep)' }}>{selectedEnquiry.channel.toUpperCase()}</strong> to <strong style={{ color: 'var(--primary-deep)' }}>{selectedEnquiry.contact}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {isFollowUpMode && (
                      <button
                        type="button"
                        onClick={() => setIsFollowUpMode(false)}
                        className="btn-secondary"
                        style={{ padding: '0.75rem 1.2rem', fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={handleSendReply}
                      disabled={sendingReply}
                      className="btn-primary"
                      style={{
                        padding: '0.75rem 1.8rem',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(26,51,35,0.2)'
                      }}
                    >
                      <Send size={15} />
                      <span>
                        {sendingReply ? 'Transmitting via Gateway...' : `Approve & Dispatch via ${selectedEnquiry.channel.toUpperCase()}`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E6E1D8',
            borderRadius: '10px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            Select an inbound lead from the left pane to review parameters, tariff grounding, and approve communication dispatch.
          </div>
        )}
      </div>

      {/* Simulator Modal (High-Fidelity Gateway Harness) */}
      {simModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1.5rem'
        }}>
          <div className="card animate-fade" style={{ maxWidth: '600px', width: '100%', backgroundColor: '#FFFFFF', padding: '2.2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)' }}>
              Simulate Inbound Channel Lead
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              Test how omnichannel messages (WhatsApp, forwarded emails, web submissions) are ingested, classified, grounded against live tariffs, and routed to the proper lead owner.
            </p>

            {/* Quick Test Presets from Problem Brief */}
            <div style={{ marginBottom: '1.4rem' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Official Assignment Test Presets:
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('web');
                    setSimSender("Meera Sen (Sister's Wedding)");
                    setSimContact('meera.sen@outlook.com');
                    setSimMessage("Venue for my sister's wedding in Feb 2027, about 250 guests, 2 nights");
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', backgroundColor: '#FAF8F5', borderRadius: '4px', border: '1px solid #D5CEBF', cursor: 'pointer' }}
                >
                  ENQ-4410 (Wedding &bull; 250 Pax)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('whatsapp');
                    setSimSender('Dr. Vivek Kulkarni');
                    setSimContact('+91 97401 88290');
                    setSimMessage('Is a villa free 14-16 Nov for 2 adults and a child?');
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', backgroundColor: '#FAF8F5', borderRadius: '4px', border: '1px solid #D5CEBF', cursor: 'pointer' }}
                >
                  ENQ-4411 (Room &bull; Villa 2N)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('email');
                    setSimSender('Siddharth Menon (RazorTech VP)');
                    setSimContact('siddharth.m@razortech.io');
                    setSimMessage('Team of 45 wants a January offsite with a conference hall');
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', backgroundColor: '#FAF8F5', borderRadius: '4px', border: '1px solid #D5CEBF', cursor: 'pointer' }}
                >
                  ENQ-4412 (Corporate &bull; 45 Pax)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('whatsapp');
                    setSimSender('Girish Chawla (Villa 4 Guest)');
                    setSimContact('+91 98110 44521');
                    setSimMessage('Water pressure in Villa 4 bathroom is too low, and no one answered the front desk line at 7:30 AM.');
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', backgroundColor: '#FDF2F2', color: '#C0392B', borderRadius: '4px', border: '1px solid #FFCDD2', cursor: 'pointer' }}
                >
                  Complaint (GM Priority)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimChannel('web');
                    setSimSender('Anonymous Website Visitor');
                    setSimContact('+91 99000 12345');
                    setSimMessage('Hi, please send all your information.');
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', backgroundColor: '#FFFBEB', color: '#B45309', borderRadius: '4px', border: '1px solid #FDE68A', cursor: 'pointer' }}
                >
                  Vague / Low Conf (Unsorted Queue)
                </button>
              </div>
            </div>

            <form onSubmit={handleSimulateInbound} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Inbound Gateway Channel
                  </label>
                  <select
                    value={simChannel}
                    onChange={(e) => setSimChannel(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #D5CEBF', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="whatsapp">WhatsApp Business Gateway</option>
                    <option value="email">Concierge Email Ingestion</option>
                    <option value="web">Direct Website Booking Form</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={simSender}
                    onChange={(e) => setSimSender(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #D5CEBF', borderRadius: '6px', fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Contact Information (Mobile Phone / Email)
                </label>
                <input
                  type="text"
                  value={simContact}
                  onChange={(e) => setSimContact(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #D5CEBF', borderRadius: '6px', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Inbound Message Body
                </label>
                <textarea
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #D5CEBF', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSimModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simulating}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
                >
                  {simulating ? 'Ingesting & Routing...' : 'Simulate Inbound Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
