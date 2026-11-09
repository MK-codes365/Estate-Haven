import React, { createContext, useContext, useState, useMemo } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  // Generate tomorrow and day-after-tomorrow as default booking dates
  const [dates] = useState(() => {
    const today = new Date();
    const dIn = new Date(today);
    dIn.setDate(today.getDate() + 1);
    const dOut = new Date(today);
    dOut.setDate(today.getDate() + 3);
    return {
      checkIn: dIn.toISOString().split('T')[0],
      checkOut: dOut.toISOString().split('T')[0]
    };
  });

  const [checkIn, setCheckIn] = useState(dates.checkIn);
  const [checkOut, setCheckOut] = useState(dates.checkOut);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState('CP'); // Default to Bed & Breakfast
  const [promoCode, setPromoCode] = useState('DIRECT10'); // Default to the 10% direct saving code

  const contextValue = useMemo(() => ({
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    selectedRoom,
    setSelectedRoom,
    selectedPlanCode,
    setSelectedPlanCode,
    promoCode,
    setPromoCode
  }), [
    checkIn,
    checkOut,
    adults,
    childrenCount,
    selectedRoom,
    selectedPlanCode,
    promoCode
  ]);

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
}

