const db = require('../db/database');

/**
 * Generates CSV export of bookings for the Property Management System (PMS)
 */
function generateDailyBookingExportCSV(targetDate = null) {
  let query = `
    SELECT 
      b.booking_reference,
      b.created_at,
      b.guest_name,
      b.guest_email,
      b.guest_phone,
      r.name as room_type,
      b.check_in_date,
      b.check_out_date,
      b.nights,
      b.rooms_count,
      b.adults,
      b.children,
      b.rate_plan_code,
      b.base_amount,
      b.gst_rate,
      b.gst_amount,
      b.discount_amount,
      b.total_amount,
      b.promo_code,
      b.payment_status,
      b.payment_id,
      b.special_requests,
      b.dpdp_consent,
      b.form_c_verified_at_checkin
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
  `;

  const params = [];
  if (targetDate) {
    query += ` WHERE b.check_in_date = ? OR DATE(b.created_at) = ? `;
    params.push(targetDate, targetDate);
  }

  query += ` ORDER BY b.check_in_date ASC, b.created_at DESC `;

  const bookings = db.prepare(query).all(...params);

  // CSV Headers conforming to Hotel PMS standards
  const headers = [
    'Reservation Reference',
    'Booking Date',
    'Guest Name',
    'Guest Email',
    'Guest Phone',
    'Room Category',
    'Check-In Date',
    'Check-Out Date',
    'Nights',
    'Rooms Count',
    'Adults',
    'Children',
    'Rate Plan',
    'Base Amount (INR)',
    'GST Rate (%)',
    'GST Amount (INR)',
    'Discount (INR)',
    'Total Amount (INR)',
    'Promo Code',
    'Payment Status',
    'Payment Reference',
    'Special Requests',
    'DPDP Consent Status',
    'Form C Verified at Check-in'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = bookings.map(b => [
    escapeCSV(b.booking_reference),
    escapeCSV(b.created_at),
    escapeCSV(b.guest_name),
    escapeCSV(b.guest_email),
    escapeCSV(b.guest_phone),
    escapeCSV(b.room_type),
    escapeCSV(b.check_in_date),
    escapeCSV(b.check_out_date),
    b.nights,
    b.rooms_count,
    b.adults,
    b.children,
    escapeCSV(b.rate_plan_code),
    b.base_amount,
    Math.round(b.gst_rate * 100),
    b.gst_amount,
    b.discount_amount,
    b.total_amount,
    escapeCSV(b.promo_code || 'NONE'),
    escapeCSV(b.payment_status),
    escapeCSV(b.payment_id || 'MOCK_DIRECT_PAY'),
    escapeCSV(b.special_requests || ''),
    escapeCSV(b.dpdp_consent ? 'Consent Recorded (DPDP 2023)' : 'Pending'),
    escapeCSV(b.form_c_verified_at_checkin ? 'Verified' : 'Pending Physical Passport Check-in')
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  return {
    filename: `PMS_Daily_Export_${targetDate || new Date().toISOString().split('T')[0]}.csv`,
    csvContent,
    count: bookings.length
  };
}

module.exports = { generateDailyBookingExportCSV };
