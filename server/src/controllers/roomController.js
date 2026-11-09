const db = require('../db/database');
const allotmentService = require('../services/allotmentService');
const taxService = require('../services/taxService');

function getRooms(req, res) {
  try {
    const { checkIn, checkOut, adults, children } = req.query;

    const rooms = db.prepare('SELECT * FROM rooms ORDER BY display_order ASC').all();
    const ratePlans = db.prepare('SELECT * FROM rate_plans').all();

    const formattedRooms = rooms.map(room => {
      const plans = ratePlans.filter(p => p.room_id === room.id);
      let availability = null;
      let pricing = null;

      if (checkIn && checkOut) {
        try {
          const availResult = allotmentService.checkAvailability(room.id, checkIn, checkOut, 1);
          availability = {
            available: availResult.available,
            remaining: availResult.minAvailable,
            nights: availResult.datesChecked
          };

          // Calculate GST breakdown for this room
          const gstCalc = taxService.calculateGST(room.base_price, room.base_price * (availability.nights || 1));
          pricing = {
            basePrice: room.base_price,
            nights: availability.nights,
            gstPercentage: gstCalc.gstPercentage,
            gstAmount: gstCalc.gstAmount,
            totalWithTax: (room.base_price * (availability.nights || 1)) + gstCalc.gstAmount
          };
        } catch (err) {
          // If invalid date range
          availability = { available: false, error: err.message };
        }
      }

      return {
        id: room.id,
        name: room.name,
        slug: room.slug,
        category: room.category,
        totalKeys: room.total_keys,
        defaultWebsiteAllotment: room.default_website_allotment,
        basePrice: room.base_price,
        maxAdults: room.max_adults,
        maxChildren: room.max_children,
        sizeSqft: room.size_sqft,
        description: room.description,
        shortDescription: room.short_description,
        amenities: JSON.parse(room.amenities || '[]'),
        photos: JSON.parse(room.photos || '[]'),
        ratePlans: plans.map(p => ({
          id: p.id,
          code: p.code,
          name: p.name,
          description: p.description,
          adultAddon: p.adult_addon
        })),
        availability,
        pricing
      };
    });

    return res.json({ rooms: formattedRooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return res.status(500).json({ error: 'Failed to fetch rooms' });
  }
}

function getRoomBySlug(req, res) {
  try {
    const { slug } = req.params;
    const room = db.prepare('SELECT * FROM rooms WHERE slug = ?').get(slug);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const ratePlans = db.prepare('SELECT * FROM rate_plans WHERE room_id = ?').all(room.id);

    return res.json({
      room: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        category: room.category,
        totalKeys: room.total_keys,
        defaultWebsiteAllotment: room.default_website_allotment,
        basePrice: room.base_price,
        maxAdults: room.max_adults,
        maxChildren: room.max_children,
        sizeSqft: room.size_sqft,
        description: room.description,
        shortDescription: room.short_description,
        amenities: JSON.parse(room.amenities || '[]'),
        photos: JSON.parse(room.photos || '[]'),
        ratePlans: ratePlans.map(p => ({
          id: p.id,
          code: p.code,
          name: p.name,
          description: p.description,
          adultAddon: p.adult_addon
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    return res.status(500).json({ error: 'Failed to fetch room details' });
  }
}

function checkAvailability(req, res) {
  try {
    const { roomId, checkIn, checkOut, roomsCount } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'roomId, checkIn, and checkOut are required' });
    }

    const count = parseInt(roomsCount || '1', 10);
    const result = allotmentService.checkAvailability(roomId, checkIn, checkOut, count);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getRooms,
  getRoomBySlug,
  checkAvailability
};

