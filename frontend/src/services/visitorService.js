// Visitor Authentication & Activity Tracking Service

const API_BASE_URL = 'http://localhost:5000/api/visitors';

/**
 * Get stored visitor UUID token from localStorage
 */
export function getVisitorToken() {
  try {
    return localStorage.getItem('visitor_token');
  } catch (err) {
    console.error('Error reading visitor_token from localStorage', err);
    return null;
  }
}

/**
 * Save visitor UUID token to localStorage
 */
export function saveVisitorToken(token) {
  try {
    localStorage.setItem('visitor_token', token);
    return true;
  } catch (err) {
    console.error('Error saving visitor_token to localStorage', err);
    return false;
  }
}

/**
 * Check if visitor token exists
 */
export function hasVisitorToken() {
  return !!getVisitorToken();
}

/**
 * Validate Full Name:
 * Only alphabets, Minimum 3 words, Space separated
 */
export function validateFullName(name) {
  if (!name || typeof name !== 'string') return false;
  const words = name.trim().split(/\s+/);
  if (words.length < 3) {
    return false;
  }
  return words.every(word => /^[A-Za-z]+$/.test(word));
}

/**
 * Validate Phone:
 * Indian mobile number (10 digits starting with 6-9)
 */
export function validatePhone(phone) {
  if (!phone) return false;
  return /^[6-9]\d{9}$/.test(String(phone).trim());
}

/**
 * Validate Email
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Register or update visitor in Backend
 */
export async function registerVisitor(visitorData) {
  const token = getVisitorToken();
  const payload = {
    ...visitorData,
    visitor_token: token || undefined,
    user_agent: navigator.userAgent
  };

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to register visitor data');
  }

  const data = await response.json();
  if (data && data.visitor_token) {
    saveVisitorToken(data.visitor_token);
  }
  return data;
}

/**
 * Check token validity with backend (and update last_visit timestamp)
 */
export async function verifyVisitorToken() {
  const token = getVisitorToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/check/${encodeURIComponent(token)}`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.valid === true;
  } catch (err) {
    // If backend is offline or network error, trust localStorage token for offline/local resilience
    return true;
  }
}

/**
 * Track visitor activity in background
 * activityTypes: VIDEO_VIEW, TEST_START, TEST_SUBMIT, PDF_VIEW, PAGE_VISIT
 */
export async function trackActivity(activityType, resourceId = '', duration = 0) {
  const token = getVisitorToken();
  if (!token) return;

  try {
    fetch(`${API_BASE_URL}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_token: token,
        activity_type: activityType,
        resource_id: String(resourceId),
        duration: parseInt(duration || 0, 10)
      })
    }).catch(() => {
      // Background non-blocking failure ignore
    });
  } catch (err) {
    // Ignore error
  }
}
