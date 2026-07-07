const API_URL = 'http://localhost:5000/api';

export const api = {
  // Classes
  getClasses: async () => {
    const res = await fetch(`${API_URL}/classes`);
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
  },
  createClass: async (data: any) => {
    const res = await fetch(`${API_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create class');
    return res.json();
  },
  updateClass: async (id: string | number, data: any) => {
    const res = await fetch(`${API_URL}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update class');
    return res.json();
  },
  deleteClass: async (id: string | number) => {
    const res = await fetch(`${API_URL}/classes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete class');
    return res.json();
  },

  // Mediums
  getMediums: async () => {
    const res = await fetch(`${API_URL}/mediums`);
    if (!res.ok) throw new Error('Failed to fetch mediums');
    return res.json();
  },
  createMedium: async (data: any) => {
    const res = await fetch(`${API_URL}/mediums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create medium');
    return res.json();
  },
  updateMedium: async (id: string | number, data: any) => {
    const res = await fetch(`${API_URL}/mediums/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update medium');
    return res.json();
  },
  deleteMedium: async (id: string | number) => {
    const res = await fetch(`${API_URL}/mediums/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete medium');
    return res.json();
  },

  // Subjects
  getSubjects: async (params?: { classId?: string | number; mediumId?: string | number }) => {
    const cleanParams: any = {};
    if (params) {
      if (params.classId) cleanParams.classId = params.classId;
      if (params.mediumId) cleanParams.mediumId = params.mediumId;
    }
    const query = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_URL}/subjects?${query}`);
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return res.json();
  },
  createSubject: async (data: any) => {
    const res = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create subject');
    return res.json();
  },
  updateSubject: async (id: string | number, data: any) => {
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update subject');
    return res.json();
  },
  deleteSubject: async (id: string | number) => {
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete subject');
    return res.json();
  },

  // Videos
  getVideos: async (params?: { subjectId?: string | number }) => {
    const cleanParams: any = {};
    if (params && params.subjectId) {
      cleanParams.subjectId = params.subjectId;
    }
    const query = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_URL}/videos?${query}`);
    if (!res.ok) throw new Error('Failed to fetch videos');
    return res.json();
  },
  getVideo: async (id: string | number) => {
    const res = await fetch(`${API_URL}/videos/${id}`);
    if (!res.ok) throw new Error('Failed to fetch video');
    return res.json();
  },
  createVideo: async (data: any) => {
    const res = await fetch(`${API_URL}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create video');
    return res.json();
  },
  updateVideo: async (id: string | number, data: any) => {
    const res = await fetch(`${API_URL}/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update video');
    return res.json();
  },
  deleteVideo: async (id: string | number) => {
    const res = await fetch(`${API_URL}/videos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete video');
    return res.json();
  },
};
