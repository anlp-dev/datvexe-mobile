import ApiConfig from "../../api/ApiConfig";
import {checkToken} from "../../utils/auth";
import {jwtDecode} from "jwt-decode";

const userService = {
    async getNotifications(){
        try{
            const token = await checkToken();
            if(token == null){
                throw new Error("Đã hết phiên đăng nhập, vui lòng đăng nhập lại.")
            }
            const decoded = jwtDecode(token);
            const res = await fetch(`${ApiConfig.baseUrl}/notifice/${decoded.userId}/get`, {
                method: "GET",
                headers: ApiConfig.getAuthHeaders(token)
            });
            const data = await res.json();
            if(!res.ok){
                throw new Error("Lỗi khi lấy dữ liệu!")
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    }
}

export default userService;