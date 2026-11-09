const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'coffeeridge-super-secret-key-2026',
  DB_PATH: process.env.DB_PATH || path.join(__dirname, '../../resort.db'),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  RESORT_INFO: {
    name: 'Serai Ridge Estate & Resort',
    location: 'Chikkamagaluru, Karnataka',
    totalKeys: 76,
    roomsCount: 64,
    villasCount: 12,
    currency: 'INR',
    currencySymbol: '₹',
    gstSlabThreshold: 7500, // Tariff <= 7500 has 12% GST, > 7500 has 18% GST
    gstLowRate: 0.12,
    gstHighRate: 0.18
  }
};

