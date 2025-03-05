export const getStatusStyle = (status) => {
    switch (status) {
        case "confirmed":
            return {color: "#4CAF50"}; // Green
        case "pending":
            return {color: "#ff0000"}; // Orange
        case "payed":
            return {color: "#00ff08"};
        case "completed":
            return {color: "#2196F3"}; // Blue
        case "cancelled":
            return {color: "#ffb800"}; // Red
        default:
            return {color: "#000"};
    }
};

export const getStatusText = (status) => {
    switch (status) {
        case "confirmed":
            return "Đã xác nhận"; // Green
        case "pending":
            return "Chờ thanh toán"; // Orange
        case "payed":
            return "Đã thanh toán"
        case "completed":
            return "Đã hoàn thành"; // Blue
        case "cancelled":
            return "Đã hủy"; // Red
        case "drafted":
            return "Đã xóa"
        default:
            return "Không xác định";
    }
}