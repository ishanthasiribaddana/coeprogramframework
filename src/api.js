// API Service for COE Program Framework
// Use relative path for production (nginx proxies /api to backend)
// Use localhost for local development
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Centers API
export const centersApi = {
  getAll: () => apiCall('/centers'),
  getById: (id) => apiCall(`/centers/${id}`),
  getSummary: () => apiCall('/centers/summary/all'),
};

// Programs API
export const programsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/programs${params ? `?${params}` : ''}`);
  },
  getByCenter: (centerId) => apiCall(`/programs/center/${centerId}`),
  getById: (id) => apiCall(`/programs/${id}`),
  create: (program) => apiCall('/programs', {
    method: 'POST',
    body: JSON.stringify(program),
  }),
  update: (id, program) => apiCall(`/programs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(program),
  }),
  delete: (id) => apiCall(`/programs/${id}`, {
    method: 'DELETE',
  }),
  getTypes: () => apiCall('/programs/types/all'),
};

// Partners API
export const partnersApi = {
  getExternal: () => apiCall('/partners/external'),
  getPlacement: () => apiCall('/partners/placement'),
  createExternal: (partner) => apiCall('/partners/external', {
    method: 'POST',
    body: JSON.stringify(partner),
  }),
  createPlacement: (partner) => apiCall('/partners/placement', {
    method: 'POST',
    body: JSON.stringify(partner),
  }),
};

// Associations API
export const associationsApi = {
  getAll: () => apiCall('/associations'),
  getByCenter: (centerId) => apiCall(`/associations/center/${centerId}`),
};

// Submissions API
export const submissionsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/submissions${params ? `?${params}` : ''}`);
  },
  getById: (id) => apiCall(`/submissions/${id}`),
  create: (submission) => apiCall('/submissions', {
    method: 'POST',
    body: JSON.stringify(submission),
  }),
  updateStatus: (id, statusData) => apiCall(`/submissions/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),
  addNote: (id, note) => apiCall(`/submissions/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
  }),
};

// Health check
export const healthCheck = () => apiCall('/health');

export default {
  centers: centersApi,
  programs: programsApi,
  partners: partnersApi,
  associations: associationsApi,
  submissions: submissionsApi,
  healthCheck,
};
