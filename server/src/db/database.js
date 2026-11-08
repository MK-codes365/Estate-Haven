const Database = require('better-sqlite3');
const path = require('path');
const config = require('../config');

const db = new Database(config.DB_PATH);

// Enable foreign keys and WAL mode for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT CHECK(role IN ('guest', 'reservations_staff', 'general_manager')) NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT CHECK(category IN ('room', 'villa')) NOT NULL,
      total_keys INTEGER NOT NULL,
      default_website_allotment INTEGER NOT NULL,
      base_price INTEGER NOT NULL,
      max_adults INTEGER NOT NULL,
      max_children INTEGER NOT NULL,
      size_sqft INTEGER NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT NOT NULL,
      amenities TEXT NOT NULL, -- JSON array
      photos TEXT NOT NULL,    -- JSON array
      display_order INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS rate_plans (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      code TEXT CHECK(code IN ('EP', 'CP', 'MAP')) NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      adult_addon INTEGER DEFAULT 0,
      FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      UNIQUE(room_id, code)
    );

    CREATE TABLE IF NOT EXISTS allotments (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      date TEXT NOT NULL, -- YYYY-MM-DD
      website_allotment INTEGER NOT NULL,
      booked_count INTEGER DEFAULT 0,
      is_blackout INTEGER DEFAULT 0,
      price_override INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      UNIQUE(room_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_allotments_lookup ON allotments(room_id, date);

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      booking_reference TEXT UNIQUE NOT NULL,
      room_id TEXT NOT NULL,
      guest_id TEXT,
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      guest_phone TEXT NOT NULL,
      check_in_date TEXT NOT NULL,
      check_out_date TEXT NOT NULL,
      nights INTEGER NOT NULL,
      rooms_count INTEGER DEFAULT 1,
      adults INTEGER NOT NULL,
      children INTEGER DEFAULT 0,
      rate_plan_code TEXT NOT NULL,
      base_amount INTEGER NOT NULL,
      gst_rate REAL NOT NULL,
      gst_amount INTEGER NOT NULL,
      discount_amount INTEGER DEFAULT 0,
      total_amount INTEGER NOT NULL,
      promo_code TEXT,
      payment_status TEXT CHECK(payment_status IN ('paid', 'pending', 'failed', 'refunded')) DEFAULT 'paid',
      payment_id TEXT,
      special_requests TEXT,
      dpdp_consent INTEGER DEFAULT 1,
      form_c_verified_at_checkin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(room_id) REFERENCES rooms(id)
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      enquiry_code TEXT UNIQUE NOT NULL,
      channel TEXT CHECK(channel IN ('web', 'email', 'whatsapp')) NOT NULL,
      guest_name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT NOT NULL,
      category TEXT CHECK(category IN ('room_booking', 'wedding', 'corporate_offsite', 'complaint', 'general', 'unsorted')) NOT NULL,
      confidence REAL NOT NULL,
      extracted_dates TEXT,
      extracted_guests TEXT,
      extracted_budget TEXT,
      extracted_entities TEXT, -- JSON string
      assigned_to TEXT NOT NULL,
      assigned_role TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending_review', 'draft_ready', 'replied', 'closed')) DEFAULT 'draft_ready',
      draft_reply TEXT NOT NULL,
      is_escalated_gm INTEGER DEFAULT 0,
      sent_reply TEXT,
      replied_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      discount_type TEXT CHECK(discount_type IN ('percentage', 'flat')) NOT NULL,
      discount_value REAL NOT NULL,
      min_booking_value INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
  `);
}

initSchema();

module.exports = db;
