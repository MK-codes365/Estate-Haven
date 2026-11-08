import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoleSwitcher from './components/RoleSwitcher';

// Pages
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import WeddingEnquiryPage from './pages/WeddingEnquiryPage';
import OffsiteEnquiryPage from './pages/OffsiteEnquiryPage';
import AdminInboxPage from './pages/AdminInboxPage';
import AdminAllotmentPage from './pages/AdminAllotmentPage';
import AdminReportsPage from './pages/AdminReportsPage';
import LoginPage from './pages/LoginPage';

function MainApp() {
  const [activePage, setActivePage] = useState('home');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const { isStaff } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Evaluator Role Switcher at the very top */}
      <RoleSwitcher />

      {/* Main Luxury Header / Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Page Content Switcher */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
        {activePage === 'rooms' && <RoomsPage setActivePage={setActivePage} />}
        {activePage === 'booking' && (
          <BookingPage
            setActivePage={setActivePage}
            setConfirmedBooking={setConfirmedBooking}
          />
        )}
        {activePage === 'confirmation' && (
          <ConfirmationPage
            confirmedBooking={confirmedBooking}
            setActivePage={setActivePage}
          />
        )}
        {activePage === 'weddings' && <WeddingEnquiryPage setActivePage={setActivePage} />}
        {activePage === 'offsites' && <OffsiteEnquiryPage setActivePage={setActivePage} />}
        {activePage === 'inbox' && (
          isStaff ? <AdminInboxPage /> : <LoginPage setActivePage={setActivePage} />
        )}
        {activePage === 'allotment' && (
          isStaff ? <AdminAllotmentPage /> : <LoginPage setActivePage={setActivePage} />
        )}
        {activePage === 'reports' && (
          isStaff ? <AdminReportsPage /> : <LoginPage setActivePage={setActivePage} />
        )}
        {activePage === 'login' && <LoginPage setActivePage={setActivePage} />}
      </main>

      {/* Elegant Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainApp />
      </BookingProvider>
    </AuthProvider>
  );
}
