export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getCampaigns: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/campaigns/${qs ? `?${qs}` : ''}`);
  },
  getCampaign: (id) => request(`/api/campaigns/${id}`),
  getFilmmaker: (id) => request(`/api/filmmakers/${id}`),
  getFilmmakers: () => request('/api/filmmakers/'),
};
