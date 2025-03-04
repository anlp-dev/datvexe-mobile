import fetchWithAuth from "../../utils/fetchWithAuth";

const BookingService = {
    getByUser: (userId) => fetchWithAuth(`/booking/user/${userId}`),
    getById: (bookingId) => fetchWithAuth(`/booking/${bookingId}`),
};

export default BookingService;
