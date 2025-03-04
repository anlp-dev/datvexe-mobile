import fetchWithAuth from "../../utils/fetchWithAuth";

const PaymentService = {
    getUrlVnPayQrCode: (dataReq) => fetchWithAuth(`/payment/create-url-vnpay`, "POST", dataReq),
    updateStatusPayment: (dataReq) => fetchWithAuth(`/payment/change-status`, "PUT", dataReq),
}

export default PaymentService;