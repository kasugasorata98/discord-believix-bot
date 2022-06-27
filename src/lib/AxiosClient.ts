import axios from "axios";
import { config } from "../config";

const AxiosClient = () => {
  const axiosInstance = axios.create({
    httpsAgent: config.agentOptions,
  });
  axiosInstance.interceptors.request.use((request) => {
    return request;
  });
  return axiosInstance;
};

export default AxiosClient();
