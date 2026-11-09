const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

// Ensure database is initialized
const db = require('../src/db/database');
const allotmentService = require('../src/services/allotmentService');
const taxService = require('../src/services/taxService');
const aiRouterService = require('../src/services/aiRouterService');
const exportService = require('../src/services/exportService');

test('Tax Service - Indian GST Slab Calculation', async (t) => {
  await t.test('calculates 12% GST for tariffs <= 7,500 INR', () => {
    const tariff = 7200; // Plantation Classic Room
    const nights = 2;
    const totalBase = tariff * nights; // 14,400
    const result = taxService.calculateGST(tariff, totalBase);

    assert.equal(result.gstPercentage, 12);
    assert.equal(result.gstRate, 0.12);
    assert.equal(result.gstAmount, Math.round(14400 * 0.12)); // 1728
    assert.equal(result.cgstAmount + result.sgstAmount, result.gstAmount);
  });

  await t.test('calculates 18% GST for luxury tariffs > 7,500 INR', () => {
    const tariff = 22000; // Private Plunge Pool Villa
    const nights = 1;
    const totalBase = 22000;
    const result = taxService.calculateGST(tariff, totalBase);

    assert.equal(result.gstPercentage, 18);
    assert.equal(result.gstRate, 0.18);
    assert.equal(result.gstAmount, Math.round(22000 * 0.18)); // 3960
    assert.equal(result.cgstAmount + result.sgstAmount, result.gstAmount);
  });
});

test('Allotment Service - Concurrency & Zero-Overbooking Defense', async (t) => {
  const testRoomId = 'room-04'; // 12 keys total, 6 website allotment
  const testDateIn = '2027-05-10';
  const testDateOut = '2027-05-12'; // 2 nights

  // Reset allotment for test dates
  allotmentService.updateDailyAllotment(testRoomId, '2027-05-10', 2, 0);
  allotmentService.updateDailyAllotment(testRoomId, '2027-05-11', 2, 0);

  await t.test('permits booking within allotment limits', () => {
    const availBefore = allotmentService.checkAvailability(testRoomId, testDateIn, testDateOut, 2);
    assert.equal(availBefore.available, true);
    assert.equal(availBefore.minAvailable, 2);

    const reserveRes = allotmentService.reserveAllotment(testRoomId, testDateIn, testDateOut, 2);
    assert.equal(reserveRes.success, true);

    const availAfter = allotmentService.checkAvailability(testRoomId, testDateIn, testDateOut, 1);
    assert.equal(availAfter.available, false);
    assert.equal(availAfter.minAvailable, 0);
  });

  await t.test('strictly blocks overbooking when allotment is exhausted', () => {
    assert.throws(
      () => {
        allotmentService.reserveAllotment(testRoomId, testDateIn, testDateOut, 1);
      },
      (err) => {
        return err.message.includes('Overbooking Protection') || err.message.includes('exhausted');
      }
    );
  });

  await t.test('safely releases allotment and allows subsequent bookings', () => {
    allotmentService.releaseAllotment(testRoomId, testDateIn, testDateOut, 2);
    const availRestored = allotmentService.checkAvailability(testRoomId, testDateIn, testDateOut, 2);
    assert.equal(availRestored.available, true);
    assert.equal(availRestored.minAvailable, 2);
  });

  await t.test('blocks bookings on blackout dates', () => {
    allotmentService.updateDailyAllotment(testRoomId, '2027-05-10', 2, 1); // Turn on blackout
    assert.throws(
      () => {
        allotmentService.reserveAllotment(testRoomId, testDateIn, testDateOut, 1);
      },
      (err) => err.message.includes('Blackout')
    );
    // Reset blackout
    allotmentService.updateDailyAllotment(testRoomId, '2027-05-10', 2, 0);
  });
});

test('AI Enquiry Router - NLP Classification, Entity Extraction & Rate Grounding', async (t) => {
  await t.test('ENQ-4410: Classifies wedding enquiry and routes to Priya Sharma', () => {
    const message = "Venue for my sister's wedding in Feb 2027, about 250 guests, 2 nights";
    const res = aiRouterService.analyzeEnquiry(message, 'web', 'Meera');

    assert.equal(res.category, 'wedding');
    assert.ok(res.confidence > 0.90);
    assert.equal(res.assignedTo, 'Priya Sharma');
    assert.equal(res.assignedRole, 'Wedding & Events Lead');
    assert.ok(res.extractedDates.toLowerCase().includes('feb'));
    assert.ok(res.extractedGuests.includes('250'));
    assert.ok(res.draftReply.includes('Bhadra Lawns'));
  });

  await t.test('ENQ-4411: Classifies villa room booking and grounds prices in database rate table', () => {
    const message = 'Is a villa free 14-16 Nov for 2 adults and a child?';
    const res = aiRouterService.analyzeEnquiry(message, 'whatsapp', 'Vivek');

    assert.equal(res.category, 'room_booking');
    assert.equal(res.assignedTo, 'Ananya Joshi');
    assert.ok(res.extractedGuests.includes('2 Adult'));
    assert.ok(res.draftReply.includes('22,000')); // Verifies rate table grounding from DB!
    assert.ok(res.draftReply.includes('18% GST')); // Verifies correct GST slab in quote
  });

  await t.test('ENQ-4412: Classifies corporate offsite and routes to Vikram Rao', () => {
    const message = 'Team of 45 wants a January offsite with a conference hall';
    const res = aiRouterService.analyzeEnquiry(message, 'email', 'Siddharth');

    assert.equal(res.category, 'corporate_offsite');
    assert.equal(res.assignedTo, 'Vikram Rao');
    assert.ok(res.extractedGuests.includes('45'));
    assert.ok(res.draftReply.includes('Conference Pavilion'));
  });

  await t.test('Guest Complaint: Immediately triggers critical escalation to General Manager', () => {
    const message = 'Urgent: Water pressure in Villa 4 was zero and front desk was completely unresponsive!';
    const res = aiRouterService.analyzeEnquiry(message, 'whatsapp', 'Guest');

    assert.equal(res.category, 'complaint');
    assert.equal(res.isEscalatedGM, 1);
    assert.equal(res.assignedTo, 'Rajesh Nair');
    assert.equal(res.assignedRole, 'General Manager');
    assert.ok(res.draftReply.includes('Rajesh Nair'));
    assert.ok(res.draftReply.includes('Duty Manager and Chief Engineer'));
  });

  await t.test('Ambiguous Enquiry: Routes to Unsorted Lane with low confidence', () => {
    const message = 'Can someone call me?';
    const res = aiRouterService.analyzeEnquiry(message, 'web', 'Unknown');

    assert.equal(res.category, 'unsorted');
    assert.ok(res.confidence < 0.70);
    assert.equal(res.assignedRole, 'Unsorted Review Lane');
  });

  await t.test('Multi-Engine Async Router: Executes dual engine with instant fallback', async () => {
    const message = 'Is a villa free for this weekend?';
    const res = await aiRouterService.analyzeEnquiryAsync(message, 'web', 'Test');
    assert.equal(res.category, 'room_booking');
    assert.ok(res.draftReply.includes('22,000'));
    assert.ok(res.engine.includes('NLP') || res.engine.includes('Gemini'));
  });
});

test('Export Service - PMS CSV Daily Export', async (t) => {
  const exportData = exportService.generateDailyBookingExportCSV();
  assert.ok(exportData.filename.startsWith('PMS_Daily_Export'));
  assert.ok(exportData.csvContent.includes('Reservation Reference'));
  assert.ok(exportData.csvContent.includes('Room Category'));
  assert.ok(exportData.csvContent.includes('DPDP Consent Status'));
  assert.ok(exportData.csvContent.includes('Form C Verified at Check-in'));
});

