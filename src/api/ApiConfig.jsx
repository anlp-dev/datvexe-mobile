const API_URL = "http://10.0.2.2:9999";
const API_URL_IP = "https://api.datvexe-manage.id.vn";
const API = "http://localhost:9999"
const API_URL_LOCAL = "https://829b-14-248-82-147.ngrok-free.app"

const headers = {
    'Content-Type': 'application/json',
};

const getAuthHeaders = (token) => ({
    ...headers,
    'Authorization': `Bearer ${token}`,
});

const apiConfig = {
    baseUrl: API_URL_LOCAL,
    headers,
    getAuthHeaders,
};

export default apiConfig;
