const API_URL = "http://10.0.2.2:9999";
const API_URL_IP = "https://api.datvexe-manage.id.vn";
const API = "http://localhost:9999"
const API_URL_DEPLOY = "https://datvexe-backend.onrender.com"

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