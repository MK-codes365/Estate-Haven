const db = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

function seedDatabase() {
  console.log('Seeding database with realistic Chikkamagaluru Coffee Estate Resort data...');

  // 1. Seed Users
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCheck.count === 0) {
    const passwordHashAdmin = bcrypt.hashSync('admin123', 10);
    const passwordHashGuest = bcrypt.hashSync('guest123', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'usr-gm-01',
      'gm@coffeeridge.com',
      passwordHashAdmin,
      'Rajesh Nair (General Manager)',
      'general_manager',
      '+91 98450 11223'
    );

    insertUser.run(
      'usr-res-01',
      'reservations@coffeeridge.com',
      passwordHashAdmin,
      'Ananya Joshi (Reservations Lead)',
      'reservations_staff',
      '+91 98450 33445'
    );

    insertUser.run(
      'usr-guest-01',
      'guest@example.com',
      passwordHashGuest,
      'Rohan Mehta',
      'guest',
      '+91 98765 43210'
    );
  }

  // 2. Seed Rooms (76 keys total: 64 rooms + 12 villas)
  const roomCheck = db.prepare('SELECT COUNT(*) as count FROM rooms').get();
  if (roomCheck.count === 0) {
    const insertRoom = db.prepare(`
      INSERT INTO rooms (
        id, name, slug, category, total_keys, default_website_allotment,
        base_price, max_adults, max_children, size_sqft, description,
        short_description, amenities, photos, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Room 1: Plantation Classic Room (28 keys)
    insertRoom.run(
      'room-01',
      'Plantation Classic Room',
      'plantation-classic-room',
      'room',
      28,
      14, // 14 for direct website, 14 for OTAs/offline
      7200, // Tariff <= 7500 -> 12% GST
      2,
      1,
      440,
      'Nestled amidst lush Robusta coffee shrubs, our Plantation Classic Rooms feature colonial teakwood furnishings, high rafters, private verandas overlooking the estate gardens, and luxurious artisan bath amenities infused with local coffee blossoms.',
      'Peaceful 440 sq.ft estate room with garden sit-out and heritage teak furnishings.',
      JSON.stringify(['King Bed', 'Coffee Estate View', 'High-Speed Wi-Fi', 'Ensuite Rain Shower', 'Handcrafted Pour-over Coffee Bar', 'Work Desk', 'Climate Control']),
      JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
      ]),
      1
    );

    // Room 2: Estate Valley Suite (24 keys)
    insertRoom.run(
      'room-02',
      'Estate Valley Suite',
      'estate-valley-suite',
      'room',
      24,
      12, // 12 for direct website
      9800, // Tariff > 7500 -> 18% GST
      3,
      1,
      680,
      'Perched on the eastern ridge overlooking the Baba Budangiri misty valley, this suite offers panoramic sunrise views, an expansive glass-walled lounge, deep soaking terrazzo bathtub, and a spacious balcony suspended over the plantation canopy.',
      'Panoramic 680 sq.ft valley-view suite with glass lounge and mountain sunrise balcony.',
      JSON.stringify(['King Bed + Daybed', 'Panoramic Valley View', 'Private Sunrise Balcony', 'Deep Terrazzo Tub', 'Espresso Machine', 'Smart TV with Streaming', 'Complimentary Evening High Tea']),
      JSON.stringify([
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
      ]),
      2
    );

    // Room 3: Heritage Planter\'s Cottage (12 keys)
    insertRoom.run(
      'room-03',
      "Heritage Planter's Cottage",
      'heritage-planters-cottage',
      'room',
      12,
      6, // 6 for direct website
      14500, // Tariff > 7500 -> 18% GST
      3,
      2,
      880,
      'A standalone 1920s British planter-style cottage crafted with local red laterite stone and rosewood. Features a private courtyard, antique four-poster brass bed, fireplace for crisp mountain nights, and a sheltered veranda with antique lounge planters chairs.',
      'Standalone 880 sq.ft vintage stone cottage with wood fireplace and private courtyard.',
      JSON.stringify(['Antique Four-Poster Bed', 'Stone Fireplace', 'Private Garden Courtyard', 'Butler On-Call', 'Estate Walk & Birding Kit', 'Luxury Bathrobe & Slippers', 'Minibar']),
      JSON.stringify([
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
      ]),
      3
    );

    // Room 4: Private Plunge Pool Villa (12 keys)
    insertRoom.run(
      'room-04',
      'Private Plunge Pool Villa',
      'private-plunge-pool-villa',
      'villa',
      12,
      6, // 6 for direct website
      22000, // Tariff > 7500 -> 18% GST
      4,
      2,
      1350,
      'The crown jewel of Company A. Ultra-luxury villa sequestered in 100-year-old silver oak trees. Boasts a temperature-controlled infinity plunge pool overlooking the coffee estate, open-sky rain shower, private sundeck, dedicated butler service, and private in-villa dining pavilion.',
      'Ultra-luxury 1,350 sq.ft villa with private heated plunge pool, sundeck and dedicated butler.',
      JSON.stringify(['Private Heated Plunge Pool', 'Sundeck & Daybeds', 'Dedicated Estate Butler', 'Open-Air Sky Shower', 'Curated Wine Fridge', 'In-Villa Dining Gazebo', 'Complimentary Plantation Jeep Safari']),
      JSON.stringify([
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ]),
      4
    );

    console.log('Created 4 room categories totaling 76 keys (64 rooms + 12 villas).');
  }

  // 3. Seed Rate Plans (EP, CP, MAP for each room)
  const rateCheck = db.prepare('SELECT COUNT(*) as count FROM rate_plans').get();
  if (rateCheck.count === 0) {
    const insertRatePlan = db.prepare(`
      INSERT INTO rate_plans (id, room_id, code, name, description, adult_addon)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const rooms = db.prepare('SELECT id FROM rooms').all();
    rooms.forEach(r => {
      insertRatePlan.run(
        `rp-${r.id}-ep`,
        r.id,
        'EP',
        'European Plan (Room Only)',
        'Accommodation only. Ideal for explorers venturing out for local dining.',
        0
      );

      insertRatePlan.run(
        `rp-${r.id}-cp`,
        r.id,
        'CP',
        'Continental Plan (Bed & Breakfast)',
        'Includes daily lavish buffet breakfast with fresh estate-grown Arabica/Robusta coffee.',
        750
      );

      insertRatePlan.run(
        `rp-${r.id}-map`,
        r.id,
        'MAP',
        'Modified American Plan (Breakfast + Dinner)',
        'Includes lavish estate breakfast and gourmet 4-course Malnad dinner buffet at The Planter’s Table.',
        1950
      );
    });
  }

  // 4. Seed Allotments for next 90 days
  const allotmentCheck = db.prepare('SELECT COUNT(*) as count FROM allotments').get();
  if (allotmentCheck.count === 0) {
    const insertAllotment = db.prepare(`
      INSERT OR IGNORE INTO allotments (id, room_id, date, website_allotment, booked_count, is_blackout, price_override)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const rooms = db.prepare('SELECT id, default_website_allotment FROM rooms').all();
    const today = new Date();

    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      rooms.forEach(room => {
        // Sample weekend surge or blackout on specific date
        const isWeekend = d.getDay() === 5 || d.getDay() === 6;
        const isSampleBlackout = (i === 15); // Blackout day 15 for private resort buyout simulation
        const priceOverride = isWeekend ? null : null;

        insertAllotment.run(
          `alt-${room.id}-${dateStr}`,
          room.id,
          dateStr,
          room.default_website_allotment,
          0,
          isSampleBlackout ? 1 : 0,
          priceOverride
        );
      });
    }
    console.log('Generated 90 days of inventory & allotment records.');
  }

  // 5. Seed Promo Codes
  const promoCheck = db.prepare('SELECT COUNT(*) as count FROM promo_codes').get();
  if (promoCheck.count === 0) {
    const insertPromo = db.prepare(`
      INSERT INTO promo_codes (code, description, discount_type, discount_value, min_booking_value, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPromo.run('DIRECT10', '10% Direct Booking Discount on all website reservations', 'percentage', 10, 5000, 1);
    insertPromo.run('ESTATE2000', 'Flat ₹2,000 off on stays of 2 nights or more', 'flat', 2000, 12000, 1);
    insertPromo.run('CHIKKA2026', 'Special ₹1,000 welcome voucher', 'flat', 1000, 7000, 1);
  }

  // 6. Seed Sample Bookings (to reflect realistic occupancy and verify allotment decrement)
  const bookingCheck = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
  if (bookingCheck.count === 0) {
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        id, booking_reference, room_id, guest_id, guest_name, guest_email, guest_phone,
        check_in_date, check_out_date, nights, rooms_count, adults, children,
        rate_plan_code, base_amount, gst_rate, gst_amount, discount_amount, total_amount,
        promo_code, payment_status, payment_id, special_requests, dpdp_consent, form_c_verified_at_checkin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateAllotment = db.prepare(`
      UPDATE allotments SET booked_count = booked_count + 1 WHERE room_id = ? AND date = ?
    `);

    const d1 = new Date();
    d1.setDate(d1.getDate() + 2);
    const in1 = d1.toISOString().split('T')[0];
    const d2 = new Date(d1);
    d2.setDate(d2.getDate() + 2);
    const out1 = d2.toISOString().split('T')[0];

    insertBooking.run(
      'bk-01',
      'CR-2026-8812',
      'room-02', // Valley Suite
      'usr-guest-01',
      'Arunachalam Murugan',
      'arun.m@example.com',
      '+91 94432 19823',
      in1,
      out1,
      2,
      1,
      2,
      0,
      'CP',
      21100,
      0.18,
      3798,
      2110,
      22788,
      'DIRECT10',
      'paid',
      'pay_mock_9817294812',
      'Anniversary celebration; high-floor valley view preferred.',
      1,
      0
    );

    // Update allotment count for those 2 nights
    updateAllotment.run('room-02', in1);
    const nextNight = new Date(d1);
    nextNight.setDate(nextNight.getDate() + 1);
    updateAllotment.run('room-02', nextNight.toISOString().split('T')[0]);
  }

  // 7. Seed Enquiries (Matching the prompt's explicit sample data + edge cases)
  const enquiryCheck = db.prepare('SELECT COUNT(*) as count FROM enquiries').get();
  if (enquiryCheck.count === 0) {
    const insertEnquiry = db.prepare(`
      INSERT INTO enquiries (
        id, enquiry_code, channel, guest_name, contact, message, category, confidence,
        extracted_dates, extracted_guests, extracted_budget, extracted_entities,
        assigned_to, assigned_role, status, draft_reply, is_escalated_gm
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // ENQ-4410 (From brief: Wedding, Feb 2027, 250 guests, 2 nights)
    insertEnquiry.run(
      'enq-01',
      'ENQ-4410',
      'web',
      'Meera Sen & Family',
      'meera.sen@outlook.com | +91 98201 55431',
      "Venue for my sister's wedding in Feb 2027, about 250 guests, 2 nights",
      'wedding',
      0.97,
      'February 2027 (2 nights)',
      '250 guests',
      'Bhadra Lawn + Estate Canopy package',
      JSON.stringify({ event: 'Wedding', nights: 2, guests: 250, lawn: 'Bhadra Lawn (500 cap)', dates: 'Feb 2027' }),
      'Priya Sharma',
      'Wedding & Events Lead',
      'draft_ready',
      `Dear Meera,\n\nWarm greetings from The Serai Ridge Estate & Resort, Chikkamagaluru.\n\nCongratulations on your sister's upcoming wedding! We would be honored to host your 250 guests across our 76 keys (64 estate suites and 12 plunge pool villas) and our sprawling Bhadra Lawns for a magical 2-night celebration in February 2027.\n\nOur residential wedding package includes:\n- Exclusive estate buyout option with 76 keys for 2 nights\n- Bhadra Lawn & Planter's Ballroom access for Sangeet, Pheras and Reception\n- Curated royal Malnad and multi-cuisine banqueting\n- Dedicated wedding concierge and logistics liaison\n\nI have attached our 2027 Wedding Brochure. Could we schedule a brief 10-minute call tomorrow at 11:30 AM to understand your vision and share an itemized proposal?\n\nWarm regards,\nPriya Sharma\nWedding & Events Lead | Serai Ridge Estate`,
      0
    );

    // ENQ-4411 (From brief: Room booking, 14-16 Nov, 2 adults + 1 child, Villa)
    insertEnquiry.run(
      'enq-02',
      'ENQ-4411',
      'whatsapp',
      'Dr. Vivek Kulkarni',
      '+91 97401 88290',
      'Is a villa free 14-16 Nov for 2 adults and a child?',
      'room_booking',
      0.95,
      '14-16 November (2 nights)',
      '2 Adults, 1 Child',
      'Tariff: ₹22,000/night + 18% GST',
      JSON.stringify({ room_type: 'Private Plunge Pool Villa', check_in: '14 Nov', check_out: '16 Nov', adults: 2, children: 1, base_rate: 22000 }),
      'Ananya Joshi',
      'Reservations Desk',
      'draft_ready',
      `Dear Dr. Vivek,\n\nThank you for reaching out to Serai Ridge Estate & Resort!\n\nWe are delighted to confirm that our *Private Plunge Pool Villa* currently has 3 units available in our direct allotment for 14-16 November (2 nights) for 2 adults and 1 child.\n\nRate Details (Grounded in Resort Rate Table):\n- Villa Tariff: ₹22,000 per night (European Plan)\n- Continental Plan (Includes gourmet buffet breakfast): ₹23,500 per night\n- GST Applicable: 18% (standard luxury hospitality tariff slab)\n- Direct Website Privilege: Use promo code DIRECT10 on our website for an instant 10% saving!\n\nYou can book directly with instant confirmation on our portal, or I can hold the villa for you for the next 4 hours while you decide.\n\nWarm regards,\nAnanya Joshi\nReservations Desk | Serai Ridge Estate`,
      0
    );

    // ENQ-4412 (From brief: Corporate offsite, January, 45 guests, conference hall)
    insertEnquiry.run(
      'enq-03',
      'ENQ-4412',
      'email',
      'Siddharth Menon (VP HR, RazorTech)',
      'siddharth.m@razortech.io',
      'Team of 45 wants a January offsite with a conference hall',
      'corporate_offsite',
      0.96,
      'January (Flexible dates)',
      '45 delegates',
      'Conference hall + twin sharing suites',
      JSON.stringify({ offsite_size: 45, facility: 'Conference Hall with AV', season: 'January' }),
      'Vikram Rao',
      'Corporate Sales Lead',
      'draft_ready',
      `Dear Siddharth,\n\nThank you for considering Serai Ridge Estate & Resort for RazorTech's leadership offsite in January.\n\nWe frequently host premier tech leadership retreats. For a team of 45 delegates, we recommend:\n- 23 Estate Suites on twin-sharing basis (or single occupancy across 45 suites)\n- Full-day access to The Planter's Boardroom & Conference Pavilion (80-seat capacity, 4K projection, high-gain microphones, and backup fibre connectivity)\n- Plantation team-building coffee harvest challenge and twilight bonfire with live acoustic guitarist\n- Curated breakfast, conference luncheon and barbecue networking dinner\n\nMay I share a customized corporate package with preferred weekday rates for your team?\n\nWarm regards,\nVikram Rao\nCorporate Sales Lead | Serai Ridge Estate`,
      0
    );

    // ENQ-4413 (Edge Case: Guest Complaint -> Auto GM Escalation)
    insertEnquiry.run(
      'enq-04',
      'ENQ-4413',
      'whatsapp',
      'Girish Chawla (Villa 4 Guest)',
      '+91 98110 44521',
      'Urgent: Water pressure in Villa 4 was zero this morning and front desk did not answer the phone for 25 minutes! Very frustrating service for a 5-star tariff.',
      'complaint',
      0.98,
      'Today (Immediate)',
      'Current In-House Guest (Villa 4)',
      'High Priority Escalation',
      JSON.stringify({ sentiment: 'Extremely Dissatisfied', issue: 'Water pressure & unresponsive front desk', room: 'Villa 4' }),
      'Rajesh Nair',
      'General Manager',
      'pending_review',
      `Dear Mr. Chawla,\n\nI am writing to you personally as the General Manager of Serai Ridge Estate. I sincerely apologize for the inexcusable delay you experienced with our front desk and the water pressure disturbance in Villa 4 this morning.\n\nOur Chief Engineer has been dispatched immediately to Villa 4 to rectify the pressure booster pump, and I have personally addressed the front desk supervisor regarding the unanswered call.\n\nI would like to meet you in person at your convenience or invite you and your family for complimentary dinner at The Planter’s Table tonight as a token of our sincere apology.\n\nRespectfully,\nRajesh Nair\nGeneral Manager | Direct Mobile: +91 98450 11223`,
      1 // is_escalated_gm = 1
    );

    // ENQ-4414 (Edge Case: Ambiguous / Low Confidence -> Unsorted Lane)
    insertEnquiry.run(
      'enq-05',
      'ENQ-4414',
      'web',
      'Anonymous Visitor',
      '+91 99000 12345',
      'Hey I might want to visit sometime with family, tell me details',
      'unsorted',
      0.44, // Low confidence
      'Unspecified',
      'Family (Count unknown)',
      'Pending classification',
      JSON.stringify({ ambiguous: true, reason: 'Lacks dates, guest count, and specific room/event details' }),
      'Rajesh Nair / Triage Desk',
      'Unsorted Review Lane',
      'pending_review',
      `Dear Guest,\n\nThank you for reaching out to Serai Ridge Estate & Resort in Chikkamagaluru.\n\nWe would love to welcome you and your family to our coffee plantation retreat! To help us recommend the perfect stay package, could you kindly let us know your tentative travel dates and how many adults and children will be visiting?\n\nYou can also explore our room options and direct booking rates on our website.\n\nWarm regards,\nReservations Desk | Serai Ridge Estate`,
      0
    );

    console.log('Seeded sample enquiries including ENQ-4410, 4411, 4412, GM complaint escalation and unsorted lane.');
  }

  console.log('Database initialization and seeding completed successfully!');
}

seedDatabase();

module.exports = { seedDatabase };

