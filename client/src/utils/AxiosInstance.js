import axios from "axios";


export const AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
    withCredentials: true,
})