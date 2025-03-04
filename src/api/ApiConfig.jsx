const API_URL = "http://10.0.2.2:9999";
const API_URL_IP = "https://5154-2405-4802-4b8-83a0-a038-e39f-e63c-4dbe.ngrok-free.app";
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
    baseUrl: API_URL_IP,
    headers,
    getAuthHeaders,
};

export default apiConfig;