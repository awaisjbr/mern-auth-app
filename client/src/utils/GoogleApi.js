import { AxiosInstance } from "./AxiosInstance";


export const googleAuth = (code) => AxiosInstance.get(`/auth/google?code=${code}`);