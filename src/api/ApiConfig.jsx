const API_URL = "http://10.0.2.2:9999";
const API_URL_IP = "https://7cd7-2405-4802-210-9770-8575-c682-344f-7544.ngrok-free.app";
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