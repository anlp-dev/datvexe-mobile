import {checkToken} from "../../utils/auth";
import ApiConfig from "../../api/ApiConfig";

const PaymentService = {
    async getUrlVnPayQrCode(dataReq) {
        try{
            const token = await checkToken();
            if(token == null){
                throw new Error("Đã hết phiên đăng nhập, vui lòng đăng nhập lại.")
            }
            const res = await fetch(`${ApiConfig.baseUrl}/payment/create-url-vnpay`, {
                method: "POST",
                headers: ApiConfig.getAuthHeaders(token),
                body: JSON.stringify(dataReq)
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    },
    async updateStatusPayment(dataReq){
        try{
            const token = await checkToken();
            if(token == null){
                throw new Error("Đã hết phiên đăng nhập, vui lòng đăng nhập lại.")
            }
            const res = await fetch(`${ApiConfig.baseUrl}/payment/change-status`, {
                method: "PUT",
                headers: ApiConfig.getAuthHeaders(token),
                body: JSON.stringify(dataReq)
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
            }
            return data;
        }catch (e) {
            throw new Error(e);
        }
    }
}

export default PaymentService;