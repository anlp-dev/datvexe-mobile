const API_URL = "http://10.0.2.2:9999";
const API_URL_IP = "https://api.datvexe-manage.id.vn";
const API = "http://localhost:9999"
const API_URL_LOCAL = "https://05bc-2405-4802-1f02-1000-ad90-24c6-15e2-db6c.ngrok-free.app"

const headers = {
    'Content-Type': 'application/json',
};

const getAuthHeaders = (token) => ({
    ...headers,
    'Authorization': `Bearer ${token}`,
});

const apiConfig = {
    baseUrl: API_URL,
    headers,
    getAuthHeaders,
};

export default apiConfig;
