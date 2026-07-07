// Admin service to handle authentication, dashboard stats, reports, tests, and CRUD operations.
// All data is fetched directly from the PostgreSQL backend; no frontend/local storage fallbacks are used.

const API_URL = 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('adminToken');
export const getAdminData = () => JSON.parse(localStorage.getItem('adminData') || 'null');

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid credentials');
  }
  const data = await res.json();
  localStorage.setItem('adminToken', data.token);
  localStorage.setItem('adminData', JSON.stringify(data.admin));
  return data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API caller
const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers }
  });
  if (!res.ok) {
    if (res.status === 401) {
      logout();
      window.dispatchEvent(new Event('admin-logout'));
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'API request failed');
  }
  return await res.json();
};

// Classes API
export const getClasses = () => apiRequest('/classes', { method: 'GET' });
export const addClass = (classData) => apiRequest('/classes', {
  method: 'POST',
  body: JSON.stringify(classData)
});
export const updateClass = (id, classData) => apiRequest(`/classes/${id}`, {
  method: 'PUT',
  body: JSON.stringify(classData)
});
export const deleteClass = (id) => apiRequest(`/classes/${id}`, {
  method: 'DELETE'
});

// Mediums API
export const getMediums = () => apiRequest('/mediums', { method: 'GET' });
export const addMedium = (mediumData) => apiRequest('/mediums', {
  method: 'POST',
  body: JSON.stringify(mediumData)
});
export const updateMedium = (id, mediumData) => apiRequest(`/mediums/${id}`, {
  method: 'PUT',
  body: JSON.stringify(mediumData)
});
export const deleteMedium = (id) => apiRequest(`/mediums/${id}`, {
  method: 'DELETE'
});

// Subjects API
export const getSubjects = () => apiRequest('/subjects', { method: 'GET' });
export const addSubject = (subjectData) => apiRequest('/subjects', {
  method: 'POST',
  body: JSON.stringify(subjectData)
});
export const updateSubject = (id, subjectData) => apiRequest(`/subjects/${id}`, {
  method: 'PUT',
  body: JSON.stringify(subjectData)
});
export const deleteSubject = (id) => apiRequest(`/subjects/${id}`, {
  method: 'DELETE'
});

// Videos API
export const getVideos = () => apiRequest('/videos', { method: 'GET' });
export const addVideo = (videoData) => apiRequest('/videos', {
  method: 'POST',
  body: JSON.stringify(videoData)
});
export const updateVideo = (id, videoData) => apiRequest(`/videos/${id}`, {
  method: 'PUT',
  body: JSON.stringify(videoData)
});
export const deleteVideo = (id) => apiRequest(`/videos/${id}`, {
  method: 'DELETE'
});

export const bulkUploadJSON = (videos) => apiRequest('/videos/bulk-json', {
  method: 'POST',
  body: JSON.stringify({ videos })
});

// Dashboard Stats API
export const getDashboardStats = () => apiRequest('/dashboard/stats', { method: 'GET' });

// Tests API
export const getTests = () => apiRequest('/tests', { method: 'GET' });
export const addTest = (testData) => apiRequest('/tests', {
  method: 'POST',
  body: JSON.stringify(testData)
});
export const updateTest = (id, testData) => apiRequest(`/tests/${id}`, {
  method: 'PUT',
  body: JSON.stringify(testData)
});
export const deleteTest = (id) => apiRequest(`/tests/${id}`, {
  method: 'DELETE'
});

export const bulkUploadTestsJSON = (tests) => apiRequest('/tests/bulk-json', {
  method: 'POST',
  body: JSON.stringify({ tests })
});

// Reports API
export const getReports = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.classId) queryParams.append('classId', filters.classId);
  if (filters.mediumId) queryParams.append('mediumId', filters.mediumId);
  if (filters.subjectId) queryParams.append('subjectId', filters.subjectId);
  if (filters.date) queryParams.append('date', filters.date);

  return apiRequest(`/reports?${queryParams.toString()}`, { method: 'GET' });
};

// Feedbacks API
export const getFeedbacks = () => apiRequest('/feedbacks', { method: 'GET' });
export const addFeedback = (feedbackData) => apiRequest('/feedbacks', {
  method: 'POST',
  body: JSON.stringify(feedbackData)
});
export const deleteFeedback = (id) => apiRequest(`/feedbacks/${id}`, {
  method: 'DELETE'
});
