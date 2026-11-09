const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const aiRouterService = require('../services/aiRouterService');

function generateEnquiryCode() {
  const num = Math.floor(4420 + Math.random() * 5500);
  return `ENQ-${num}`;
}

async function createEnquiry(req, res) {
  try {
    const {
      channel = 'web',
      guestName,
      contact,
      message,
      eventType,
      guestCount,
      preferredDates,
      budgetRange
    } = req.body;

    if (!message && !eventType) {
      return res.status(400).json({ error: 'Message or event description is required' });
    }

    let fullMessage = message || '';
    if (eventType) {
      fullMessage = `[Structured ${eventType} Enquiry] ${preferredDates ? 'Dates: ' + preferredDates + '. ' : ''}${guestCount ? 'Guests: ' + guestCount + '. ' : ''}${fullMessage}`;
    }

    // Run AI Router (Uses Google Gemini LLM if GEMINI_API_KEY is present, or instant local NLP engine)
    const analysis = await aiRouterService.analyzeEnquiryAsync(fullMessage, channel, guestName);

    // If explicit form sent wedding/corporate, ensure category is respected
    if (eventType === 'Wedding' && analysis.category !== 'complaint') {
      analysis.category = 'wedding';
      analysis.assignedTo = 'Priya Sharma';
      analysis.assignedRole = 'Wedding & Events Lead';
    } else if (eventType === 'Corporate Offsite' && analysis.category !== 'complaint') {
      analysis.category = 'corporate_offsite';
      analysis.assignedTo = 'Vikram Rao';
      analysis.assignedRole = 'Corporate Sales Lead';
    }

    const enquiryId = uuidv4();
    const enquiryCode = generateEnquiryCode();

    const insertStmt = db.prepare(`
      INSERT INTO enquiries (
        id, enquiry_code, channel, guest_name, contact, message, category, confidence,
        extracted_dates, extracted_guests, extracted_budget, extracted_entities,
        assigned_to, assigned_role, status, draft_reply, is_escalated_gm
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      enquiryId,
      enquiryCode,
      channel,
      guestName || 'Anonymous Guest',
      contact || 'Not provided',
      fullMessage,
      analysis.category,
      analysis.confidence,
      preferredDates || analysis.extractedDates,
      guestCount || analysis.extractedGuests,
      budgetRange || analysis.extractedBudget,
      analysis.extractedEntities,
      analysis.assignedTo,
      analysis.assignedRole,
      'draft_ready',
      analysis.draftReply,
      analysis.isEscalatedGM
    );

    const saved = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(enquiryId);

    return res.status(201).json({
      success: true,
      enquiry: {
        ...saved,
        extracted_entities: JSON.parse(saved.extracted_entities || '{}')
      }
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return res.status(500).json({ error: 'Failed to process enquiry' });
  }
}

function getEnquiries(req, res) {
  try {
    const { category, lane, status, channel, search } = req.query;

    let query = 'SELECT * FROM enquiries WHERE 1=1';
    const params = [];

    if (lane === 'unsorted') {
      query += ' AND (category = ? OR confidence < 0.70)';
      params.push('unsorted');
    } else if (lane === 'escalated') {
      query += ' AND is_escalated_gm = 1';
    } else if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (channel && channel !== 'all') {
      query += ' AND channel = ?';
      params.push(channel);
    }

    if (search) {
      query += ' AND (message LIKE ? OR guest_name LIKE ? OR enquiry_code LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY is_escalated_gm DESC, created_at DESC';

    const list = db.prepare(query).all(...params);

    const formatted = list.map(item => ({
      ...item,
      extracted_entities: JSON.parse(item.extracted_entities || '{}')
    }));

    // Stats breakdown for inbox tabs
    const counts = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN category = 'wedding' THEN 1 ELSE 0 END) as weddings,
        SUM(CASE WHEN category = 'corporate_offsite' THEN 1 ELSE 0 END) as offsites,
        SUM(CASE WHEN category = 'room_booking' THEN 1 ELSE 0 END) as roomBookings,
        SUM(CASE WHEN category = 'complaint' OR is_escalated_gm = 1 THEN 1 ELSE 0 END) as complaints,
        SUM(CASE WHEN category = 'unsorted' OR confidence < 0.70 THEN 1 ELSE 0 END) as unsorted,
        SUM(CASE WHEN status = 'draft_ready' OR status = 'pending_review' THEN 1 ELSE 0 END) as pending
      FROM enquiries
    `).get();

    return res.json({
      enquiries: formatted,
      counts
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
}

function updateEnquiry(req, res) {
  try {
    const { id } = req.params;
    const { category, assignedTo, assignedRole, draftReply, status } = req.body;

    const existing = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    db.prepare(`
      UPDATE enquiries
      SET category = COALESCE(?, category),
          assigned_to = COALESCE(?, assigned_to),
          assigned_role = COALESCE(?, assigned_role),
          draft_reply = COALESCE(?, draft_reply),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(category, assignedTo, assignedRole, draftReply, status, id);

    const updated = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
    return res.json({
      success: true,
      enquiry: {
        ...updated,
        extracted_entities: JSON.parse(updated.extracted_entities || '{}')
      }
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return res.status(500).json({ error: 'Failed to update enquiry' });
  }
}

function sendReply(req, res) {
  try {
    const { id } = req.params;
    const { finalReply } = req.body;

    const existing = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const replyText = finalReply || existing.draft_reply;

    db.prepare(`
      UPDATE enquiries
      SET sent_reply = ?,
          status = 'replied',
          replied_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(replyText, id);

    return res.json({
      success: true,
      message: `Reply sent successfully via simulated ${existing.channel.toUpperCase()}!`,
      sentAt: new Date().toISOString(),
      recipient: existing.contact,
      sentReply: replyText
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return res.status(500).json({ error: 'Failed to send reply' });
  }
}

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  sendReply
};

