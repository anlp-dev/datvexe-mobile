import ApiConfig from "../../api/ApiConfig";
import {checkToken} from "../../utils/auth";
import fetchWithAuth from "../../utils/fetchWithAuth";

const TripService = {
    loadDiaDiem: () => fetchWithAuth(`/trip/location/all`),
    loadSchedule: (dataReq) => fetchWithAuth(`/trip/schedule`, "POST", dataReq),
    loadScheduleById: (dataReq) => fetchWithAuth(`/trip/schedule/${dataReq}`),
    themMoiBooking: (dataReq) => fetchWithAuth(`/trip/create`, "POST", dataReq),
    huyBooking: (dataReq) => fetchWithAuth(`/trip/cancel`, "POST", dataReq),
}

export default TripService;