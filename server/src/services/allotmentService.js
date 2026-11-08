const db = require('../db/database');

/**
 * Returns an array of date strings (YYYY-MM-DD) for every night of the stay.
 * For example: checkIn 2026-11-14, checkOut 2026-11-16 returns ['2026-11-14', '2026-11-15']
 */
function getDateRange(checkInDateStr, checkOutDateStr) {
  const dates = [];
  const curr = new Date(checkInDateStr + 'T00:00:00');
  const end = new Date(checkOutDateStr + 'T00:00:00');

  if (curr >= end) {
    throw new Error('Check-out date must be strictly after check-in date');
  }

  while (curr < end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

/**
 * Checks allotment availability for a room across a date range.
 * Returns { available: boolean, minAvailable: number, details: Array }
 */
function checkAvailability(roomId, checkInDateStr, checkOutDateStr, requestedRooms = 1) {
  const dates = getDateRange(checkInDateStr, checkOutDateStr);
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId);
  if (!room) {
    throw new Error(`Room not found: ${roomId}`);
  }

  const stmt = db.prepare(`
    SELECT date, website_allotment, booked_count, is_blackout, price_override
    FROM allotments
    WHERE room_id = ? AND date = ?
  `);

  const details = [];
  let minAvailable = Infinity;
  let hasBlackout = false;

  for (const d of dates) {
    let row = stmt.get(roomId, d);

    // If date doesn't exist yet in allotments, create it dynamically with default allotment
    if (!row) {
      db.prepare(`
        INSERT OR IGNORE INTO allotments (id, room_id, date, website_allotment, booked_count, is_blackout)
        VALUES (?, ?, ?, ?, 0, 0)
      `).run(`alt-${roomId}-${d}`, roomId, d, room.default_website_allotment);
      row = stmt.get(roomId, d);
    }

    if (row.is_blackout) {
      hasBlackout = true;
      minAvailable = 0;
      details.push({ date: d, remaining: 0, is_blackout: true, reason: 'Blackout date' });
    } else {
      const remaining = Math.max(0, row.website_allotment - row.booked_count);
      if (remaining < minAvailable) {
        minAvailable = remaining;
      }
      details.push({
        date: d,
        website_allotment: row.website_allotment,
        booked_count: row.booked_count,
        remaining,
        is_blackout: false,
        price_override: row.price_override
      });
    }
  }

  const isAvailable = !hasBlackout && minAvailable >= requestedRooms;

  return {
    available: isAvailable,
    minAvailable: minAvailable === Infinity ? 0 : minAvailable,
    requestedRooms,
    roomName: room.name,
    datesChecked: dates.length,
    details
  };
}

/**
 * Atomically reserves allotment inside a SQLite transaction.
 * If ANY date is sold out or has insufficient allotment, it throws and rolls back.
 * Guarantees zero overbookings!
 */
const reserveAllotment = db.transaction((roomId, checkInDateStr, checkOutDateStr, requestedRooms = 1) => {
  const dates = getDateRange(checkInDateStr, checkOutDateStr);
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(roomId);
  if (!room) throw new Error('Room not found');

  const checkStmt = db.prepare(`
    SELECT website_allotment, booked_count, is_blackout
    FROM allotments
    WHERE room_id = ? AND date = ?
  `);

  const updateStmt = db.prepare(`
    UPDATE allotments
    SET booked_count = booked_count + ?, updated_at = CURRENT_TIMESTAMP
    WHERE room_id = ? AND date = ?
  `);

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO allotments (id, room_id, date, website_allotment, booked_count, is_blackout)
    VALUES (?, ?, ?, ?, 0, 0)
  `);

  // Phase 1: Verify all nights have adequate allotment
  for (const d of dates) {
    let row = checkStmt.get(roomId, d);
    if (!row) {
      insertStmt.run(`alt-${roomId}-${d}`, roomId, d, room.default_website_allotment);
      row = checkStmt.get(roomId, d);
    }

    if (row.is_blackout) {
      throw new Error(`Date ${d} is marked as Blackout. No bookings allowed.`);
    }

    const available = row.website_allotment - row.booked_count;
    if (available < requestedRooms) {
      throw new Error(
        `Overbooking Protection: Only ${Math.max(0, available)} of ${requestedRooms} requested ${room.name} available on ${d}. Direct allotment exhausted.`
      );
    }
  }

  // Phase 2: Decrement inventory / increment booked count
  for (const d of dates) {
    updateStmt.run(requestedRooms, roomId, d);
  }

  return { success: true, datesReserved: dates.length };
});

/**
 * Releases allotment if a booking is cancelled or refunded
 */
const releaseAllotment = db.transaction((roomId, checkInDateStr, checkOutDateStr, requestedRooms = 1) => {
  const dates = getDateRange(checkInDateStr, checkOutDateStr);
  const updateStmt = db.prepare(`
    UPDATE allotments
    SET booked_count = MAX(0, booked_count - ?), updated_at = CURRENT_TIMESTAMP
    WHERE room_id = ? AND date = ?
  `);

  for (const d of dates) {
    updateStmt.run(requestedRooms, roomId, d);
  }
  return { success: true, datesReleased: dates.length };
});

/**
 * Updates allotment, blackout status, or price override for a specific room and date
 */
function updateDailyAllotment(roomId, date, websiteAllotment, isBlackout, priceOverride = null) {
  const existing = db.prepare('SELECT id FROM allotments WHERE room_id = ? AND date = ?').get(roomId, date);

  if (existing) {
    db.prepare(`
      UPDATE allotments
      SET website_allotment = COALESCE(?, website_allotment),
          is_blackout = COALESCE(?, is_blackout),
          price_override = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE room_id = ? AND date = ?
    `).run(websiteAllotment, isBlackout !== undefined ? (isBlackout ? 1 : 0) : null, priceOverride, roomId, date);
  } else {
    db.prepare(`
      INSERT INTO allotments (id, room_id, date, website_allotment, booked_count, is_blackout, price_override)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(`alt-${roomId}-${date}`, roomId, date, websiteAllotment, isBlackout ? 1 : 0, priceOverride);
  }

  return { success: true, roomId, date };
}

/**
 * Fetches allotment matrix for the admin calendar
 */
function getAllotmentGrid(startDateStr, days = 14) {
  const start = new Date(startDateStr);
  const dateList = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dateList.push(d.toISOString().split('T')[0]);
  }

  const rooms = db.prepare('SELECT id, name, category, total_keys, base_price, default_website_allotment FROM rooms ORDER BY display_order').all();

  const matrix = rooms.map(room => {
    const dailyData = dateList.map(date => {
      let row = db.prepare(`
        SELECT website_allotment, booked_count, is_blackout, price_override
        FROM allotments WHERE room_id = ? AND date = ?
      `).get(room.id, date);

      if (!row) {
        row = {
          website_allotment: room.default_website_allotment,
          booked_count: 0,
          is_blackout: 0,
          price_override: null
        };
      }

      return {
        date,
        website_allotment: row.website_allotment,
        booked_count: row.booked_count,
        available: row.is_blackout ? 0 : Math.max(0, row.website_allotment - row.booked_count),
        is_blackout: Boolean(row.is_blackout),
        effective_price: row.price_override || room.base_price
      };
    });

    return {
      room,
      dailyData
    };
  });

  return {
    dates: dateList,
    matrix
  };
}

module.exports = {
  getDateRange,
  checkAvailability,
  reserveAllotment,
  releaseAllotment,
  updateDailyAllotment,
  getAllotmentGrid
};
