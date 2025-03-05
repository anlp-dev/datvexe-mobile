import ApiConfig from "../api/ApiConfig";
import { checkToken } from "./auth";

const fetchWithAuth = async (url, method = "GET", body = null) => {
    try {
        const token = await checkToken();
        if (!token) throw new Error("Đã hết phiên đăng nhập, vui lòng đăng nhập lại.");

        const options = {
            method,
            headers: ApiConfig.getAuthHeaders(token),
        };

        if (body) {
            options.body = JSON.stringify(body);
            options.headers["Content-Type"] = "application/json";
        }

        const res = await fetch(`${ApiConfig.baseUrl}${url}`, options);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Lỗi khi gọi API!");
        }

        return data;
    } catch (e) {
        throw new Error(e.message);
    }
};

export default fetchWithAuth;
