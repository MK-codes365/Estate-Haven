const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('coffeeridge_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const data = await response.json();
      errorMsg = data.error || errorMsg;
    } catch (e) {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async demoLogin(role) {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Rooms
  async getRooms(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/rooms?${query}`);
    return handleResponse(res);
  },

  async getRoomBySlug(slug) {
    const res = await fetch(`${API_BASE}/rooms/${slug}`);
    return handleResponse(res);
  },

  async checkAvailability(roomId, checkIn, checkOut, roomsCount = 1) {
    const query = new URLSearchParams({ roomId, checkIn, checkOut, roomsCount }).toString();
    const res = await fetch(`${API_BASE}/rooms/availability?${query}`);
    return handleResponse(res);
  },

  // Bookings
  async validatePromo(code, bookingValue) {
    const res = await fetch(`${API_BASE}/bookings/validate-promo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, bookingValue })
    });
    return handleResponse(res);
  },

  async createBooking(bookingPayload) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingPayload)
    });
    return handleResponse(res);
  },

  async getBookingByReference(reference) {
    const res = await fetch(`${API_BASE}/bookings/reference/${reference}`);
    return handleResponse(res);
  },

  // Enquiries & AI Router
  async createEnquiry(enquiryPayload) {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryPayload)
    });
    return handleResponse(res);
  },

  async getEnquiries(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/enquiries?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateEnquiry(id, updateData) {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(res);
  },

  async sendReply(id, finalReply) {
    const res = await fetch(`${API_BASE}/enquiries/${id}/send-reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ finalReply })
    });
    return handleResponse(res);
  },

  // Admin & Allotment
  async getAllotmentGrid(startDate, days = 14) {
    const query = new URLSearchParams({ startDate: startDate || '', days }).toString();
    const res = await fetch(`${API_BASE}/admin/allotment-grid?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateDailyAllotment(payload) {
    const res = await fetch(`${API_BASE}/admin/allotment-update`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async getAdminMetrics() {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async testOverbookingDefense(payload = {}) {
    const res = await fetch(`${API_BASE}/admin/test-overbooking-defense`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  getPMSExportUrl(date) {
    const token = localStorage.getItem('coffeeridge_token');
    return `/api/admin/pms-export?date=${date || ''}`;
  }
};
