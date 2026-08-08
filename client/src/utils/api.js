const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

export async function getConfig() {
  const response = await fetch(`${API_BASE}/api/config`);
  if (!response.ok) {
    throw new Error('Failed to fetch configuration');
  }
  return response.json();
}

export async function saveConfig(config) {
  const response = await fetch(`${API_BASE}/api/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    throw new Error('Failed to save configuration');
  }
  return response.json();
}

export async function uploadMedia(file) {
  const formData = new FormData();
  formData.append('media', file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload file');
  }
  return response.json(); // returns { url: '/uploads/filename.ext' }
}

export function getMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  return `${API_BASE}${path}`;
}
