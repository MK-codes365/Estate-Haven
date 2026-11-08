const config = require('../config');

/**
 * Calculates Indian GST for hospitality tariffs
 * Rules:
 * Tariff per room/night <= 7,500: 12% GST (6% CGST + 6% SGST)
 * Tariff per room/night > 7,500: 18% GST (9% CGST + 9% SGST)
 */
function calculateGST(effectiveDailyRatePerRoom, totalBaseAmount) {
  const isHighSlab = effectiveDailyRatePerRoom > config.RESORT_INFO.gstSlabThreshold;
  const gstRate = isHighSlab ? config.RESORT_INFO.gstHighRate : config.RESORT_INFO.gstLowRate;
  const gstPercentage = isHighSlab ? 18 : 12;

  const gstAmount = Math.round(totalBaseAmount * gstRate);
  const cgstAmount = Math.round(gstAmount / 2);
  const sgstAmount = gstAmount - cgstAmount;

  return {
    gstRate,
    gstPercentage,
    gstAmount,
    cgstAmount,
    sgstAmount,
    slabDescription: isHighSlab 
      ? '18% GST (Luxury accommodation tariff > ₹7,500/night: 9% CGST + 9% SGST)'
      : '12% GST (Standard estate tariff <= ₹7,500/night: 6% CGST + 6% SGST)'
  };
}

module.exports = { calculateGST };
