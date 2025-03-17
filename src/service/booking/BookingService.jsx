import fetchWithAuth from "../../utils/fetchWithAuth";

const BookingService = {
    getByUser: (userId) => fetchWithAuth(`/booking/user/${userId}`),
    getById: (bookingId) => fetchWithAuth(`/booking/${bookingId}`),
    getHistoryBooking: (userId) => fetchWithAuth(`/booking/history/user/${userId}`),
    getDiscount: () => fetchWithAuth("/booking/discount/user"),
};

export default BookingService;
