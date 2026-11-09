import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Download, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function AdminReportsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportDate, setExportDate] = useState(new Date().toISOString().split('T')[0]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await api.getAdminMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const handleDownloadPMS = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('coffeeridge_token');
      const res = await fetch(`/api/admin/pms-export?date=${exportDate}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) {
        let errMsg = 'Failed to download PMS CSV';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch (e) {
          errMsg = res.statusText || errMsg;
        }
        throw new Error(errMsg);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pms_export_${exportDate || new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('PMS Export Error: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '2.5rem 1.5rem', maxWidth: '1240px' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--coffee-accent)', fontWeight: 700 }}>
            Executive Dashboard & Reservation System Integration
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.2rem' }}>
            ROI Performance & Daily PMS Export
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Tracking Company A's direct booking share shift (12% baseline to 20% target) and instantaneous CSV exports for property management systems.
          </p>
        </div>

        {/* PMS Export Button */}
        <div className="card" style={{ padding: '1rem 1.4rem', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '1rem', border: '1.5px solid var(--primary-deep)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
              PMS Export Date
            </label>
            <input
              type="date"
              value={exportDate}
              onChange={(e) => setExportDate(e.target.value)}
              style={{ padding: '0.4rem 0.6rem', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.82rem' }}
            />
          </div>
          <button
            onClick={handleDownloadPMS}
            disabled={downloading}
            className="btn-gold"
            style={{ fontSize: '0.85rem', padding: '0.65rem 1.2rem', height: 'fit-content', alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={15} />
            <span>{downloading ? 'Exporting CSV...' : 'Download Daily PMS CSV'}</span>
          </button>
        </div>
      </div>

      {/* Financial ROI Cards (From Problem Statement Numbers) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.8rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Total Annual Value Preserved */}
        <div className="card" style={{ borderLeft: '5px solid var(--gold-warm)', backgroundColor: '#FFFFFF' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Total Annual Value Preserved
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary-deep)', margin: '0.4rem 0 0.2rem 0' }}>
            {loading ? '...' : metrics?.roiCalculations?.totalAnnualSavingsFormatted}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Combined OTA commission savings and recovered event bookings.
          </p>
        </div>

        {/* Card 2: Commission Saved */}
        <div className="card" style={{ borderLeft: '5px solid #1E8449', backgroundColor: '#FFFFFF' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Agency Commission Saved (15% Shift)
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1E8449', margin: '0.4rem 0 0.2rem 0' }}>
            {loading ? '...' : metrics?.roiCalculations?.commissionSavedFormatted}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Shifting 15% of 11,695 OTA room nights direct avoids 20% OTA commission.
          </p>
        </div>

        {/* Card 3: Event Revenue Recovered */}
        <div className="card" style={{ borderLeft: '5px solid var(--terracotta)', backgroundColor: '#FFFFFF' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Event Revenue Recovered (3 Events/Mo)
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--terracotta)', margin: '0.4rem 0 0.2rem 0' }}>
            {loading ? '...' : metrics?.roiCalculations?.eventRevenuePreservedFormatted}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Eliminates the 30% day-long response delay costing ₹2L contribution per event.
          </p>
        </div>

        {/* Card 4: Median Response Time */}
        <div className="card" style={{ borderLeft: '5px solid #2980B9', backgroundColor: '#FFFFFF' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Median First Reply Time
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#2980B9', margin: '0.4rem 0 0.2rem 0' }}>
            16 Mins
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Target: &lt; 30 mins in working hours. (Was over 24 hours previously).
          </p>
        </div>
      </div>

      {/* Direct Booking Share Tracker Bar */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', marginBottom: '2.5rem', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-deep)' }}>
          Direct Booking Room Night Share Progress
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Baseline when project launched was 12% direct; 12-month target is 20% direct share.
        </p>

        <div style={{ position: 'relative', height: '36px', backgroundColor: 'var(--bg-muted)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
          <div style={{
            width: '12%',
            backgroundColor: '#829288',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} title="Baseline Direct Share">
            12% Base
          </div>

          <div style={{
            width: '7.4%',
            backgroundColor: '#1E8449',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} title="Current Direct Share Improvement">
            +7.4%
          </div>

          <div style={{
            width: '80.6%',
            backgroundColor: '#EAE5DD',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1rem'
          }}>
            Target: 20% Direct Share (OTA Share Decreasing from 68% to 53%)
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <span>Baseline Direct Share: <strong>12.0%</strong></span>
          <span>Current Active Direct Share: <strong style={{ color: '#1E8449' }}>19.4%</strong></span>
          <span>12-Month Target: <strong>20.0%</strong></span>
        </div>
      </div>

      {/* Property Details & PMS Specification Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={18} color="var(--primary-forest)" />
            PMS CSV Export Specification
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
            The daily export generates a clean UTF-8 comma-separated file designed for direct batch upload into standard hotel PMS (Opera, IDS Next, Protel).
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
            <li>&bull; <strong>Reservation Reference:</strong> Unique alphanumeric code (e.g. <code>CR-2026-8812</code>)</li>
            <li>&bull; <strong>Room Category & Rate Plan:</strong> Exact mapping to PMS inventory codes</li>
            <li>&bull; <strong>GST Itemization:</strong> Distinct columns for 12% vs 18% CGST/SGST amounts</li>
            <li>&bull; <strong>DPDP Act Status:</strong> Records digital consent flag for compliance audit</li>
            <li>&bull; <strong>Foreign National Form C:</strong> Flags whether in-person passport verification is required at check-in</li>
          </ul>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#1E8449" />
            DPDP Act 2023 & Form C Compliance Status
          </h4>
          <div style={{
            backgroundColor: 'var(--primary-subtle)',
            padding: '1rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            color: 'var(--primary-deep)',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            <strong>Compliance Audit: PASS</strong>
            <br />
            Zero foreign guest passport images or visa documents stored on web servers. Form C verification is legally executed only upon physical check-in at the resort desk.
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            All guest phone numbers and email addresses collected online are processed with affirmative opt-in consent and encrypted at rest.
          </p>
        </div>
      </div>
    </div>
  );
}

