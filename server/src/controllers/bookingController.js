const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const allotmentService = require('../services/allotmentService');
const taxService = require('../services/taxService');

function generateReference() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CR-2026-${randomNum}`;
}

function validatePromo(req, res) {
  try {
    const { code, bookingValue } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }

    const promo = db.prepare('SELECT * FROM promo_codes WHERE code = ? AND is_active = 1').get(code.toUpperCase().trim());
    if (!promo) {
      return res.status(404).json({ valid: false, error: 'Invalid or expired promo code' });
    }

    const value = parseFloat(bookingValue || '0');
    if (value < promo.min_booking_value) {
      return res.status(400).json({
        valid: false,
        error: `Promo code ${promo.code} requires a minimum booking value of ₹${promo.min_booking_value.toLocaleString('en-IN')}`
      });
    }

    let discountAmount = 0;
    if (promo.discount_type === 'percentage') {
      discountAmount = Math.round((value * promo.discount_value) / 100);
    } else {
      discountAmount = Math.min(value, promo.discount_value);
    }

    return res.json({
      valid: true,
      code: promo.code,
      description: promo.description,
      discountType: promo.discount_type,
      discountValue: promo.discount_value,
      calculatedDiscount: discountAmount
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return res.status(500).json({ error: 'Failed to validate promo code' });
  }
}

function createBooking(req, res) {
  try {
    const {
      roomId,
      ratePlanCode = 'CP',
      checkInDate,
      checkOutDate,
      adults = 2,
      children = 0,
      roomsCount = 1,
      guestName,
      guestEmail,
      guestPhone,
      promoCode,
      specialRequests,
      paymentMethod = 'mock_card'
    } = req.body;

    // 1. Validation
    if (!roomId || !checkInDate || !checkOutDate || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({ error: 'Missing required booking details (room, dates, guest contact)' });
    }

    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Selected room category not found' });
    }

    const ratePlan = db.prepare('SELECT * FROM rate_plans WHERE room_id = ? AND code = ?').get(roomId, ratePlanCode) || {
      code: 'EP',
      adult_addon: 0
    };

    const dates = allotmentService.getDateRange(checkInDate, checkOutDate);
    const nights = dates.length;

    // 2. Pricing Calculation
    const effectiveDailyBase = room.base_price + (ratePlan.adult_addon * Math.max(1, adults));
    const grossBaseAmount = effectiveDailyBase * nights * roomsCount;

    let discountAmount = 0;
    let appliedPromo = null;

    if (promoCode) {
      const promo = db.prepare('SELECT * FROM promo_codes WHERE code = ? AND is_active = 1').get(promoCode.toUpperCase().trim());
      if (promo && grossBaseAmount >= promo.min_booking_value) {
        appliedPromo = promo.code;
        discountAmount = promo.discount_type === 'percentage'
          ? Math.round((grossBaseAmount * promo.discount_value) / 100)
          : Math.min(grossBaseAmount, promo.discount_value);
      }
    }

    const netBaseAmount = Math.max(0, grossBaseAmount - discountAmount);
    const dailyNetPerRoom = Math.round(netBaseAmount / (nights * roomsCount));

    // GST Calculation based on per-night tariff slab (<= 7500 -> 12%, > 7500 -> 18%)
    const gstInfo = taxService.calculateGST(dailyNetPerRoom, netBaseAmount);
    const totalPayable = netBaseAmount + gstInfo.gstAmount;

    // 3. Atomically Reserve Allotment (Prevents Overbooking)
    try {
      allotmentService.reserveAllotment(roomId, checkInDate, checkOutDate, roomsCount);
    } catch (allotmentError) {
      return res.status(409).json({
        error: allotmentError.message || 'Direct website allotment is sold out for these dates.'
      });
    }

    // 4. Save Booking Record
    const bookingId = uuidv4();
    const reference = generateReference();
    const paymentId = `pay_mock_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const insertStmt = db.prepare(`
      INSERT INTO bookings (
        id, booking_reference, room_id, guest_id, guest_name, guest_email, guest_phone,
        check_in_date, check_out_date, nights, rooms_count, adults, children,
        rate_plan_code, base_amount, gst_rate, gst_amount, discount_amount, total_amount,
        promo_code, payment_status, payment_id, special_requests, dpdp_consent, form_c_verified_at_checkin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
    `);

    insertStmt.run(
      bookingId,
      reference,
      roomId,
      req.user ? req.user.id : null,
      guestName.trim(),
      guestEmail.trim(),
      guestPhone.trim(),
      checkInDate,
      checkOutDate,
      nights,
      roomsCount,
      adults,
      children,
      ratePlanCode,
      grossBaseAmount,
      gstInfo.gstRate,
      gstInfo.gstAmount,
      discountAmount,
      totalPayable,
      appliedPromo,
      'paid',
      paymentId,
      specialRequests || ''
    );

    return res.status(201).json({
      success: true,
      booking: {
        id: bookingId,
        reference,
        roomName: room.name,
        category: room.category,
        checkInDate,
        checkOutDate,
        nights,
        roomsCount,
        adults,
        children,
        ratePlan: ratePlan.name || ratePlanCode,
        pricing: {
          grossBaseAmount,
          discountAmount,
          netBaseAmount,
          gstPercentage: gstInfo.gstPercentage,
          gstAmount: gstInfo.gstAmount,
          cgstAmount: gstInfo.cgstAmount,
          sgstAmount: gstInfo.sgstAmount,
          totalAmount: totalPayable,
          slabDescription: gstInfo.slabDescription
        },
        guest: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone
        },
        payment: {
          status: 'paid',
          paymentId,
          method: paymentMethod
        },
        legalNotices: {
          dpdpAct2023: 'Personal information recorded in compliance with the Digital Personal Data Protection Act 2023.',
          formCNotice: 'Foreign nationals: Original passport and valid Indian visa required at physical check-in for mandatory Form C registration.'
        }
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: error.message || 'Failed to process booking' });
  }
}

function getBookingByReference(req, res) {
  try {
    const { reference } = req.params;
    const booking = db.prepare(`
      SELECT b.*, r.name as room_name, r.photos, r.category
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.booking_reference = ?
    `).get(reference.toUpperCase().trim());

    if (!booking) {
      return res.status(404).json({ error: 'Booking reference not found' });
    }

    return res.json({
      booking: {
        id: booking.id,
        reference: booking.booking_reference,
        roomName: booking.room_name,
        category: booking.category,
        photos: JSON.parse(booking.photos || '[]'),
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        nights: booking.nights,
        roomsCount: booking.rooms_count,
        adults: booking.adults,
        children: booking.children,
        ratePlanCode: booking.rate_plan_code,
        baseAmount: booking.base_amount,
        gstRate: booking.gst_rate,
        gstAmount: booking.gst_amount,
        discountAmount: booking.discount_amount,
        totalAmount: booking.total_amount,
        promoCode: booking.promo_code,
        paymentStatus: booking.payment_status,
        paymentId: booking.payment_id,
        specialRequests: booking.special_requests,
        guestName: booking.guest_name,
        guestEmail: booking.guest_email,
        guestPhone: booking.guest_phone,
        createdAt: booking.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
}

module.exports = {
  validatePromo,
  createBooking,
  getBookingByReference
};

