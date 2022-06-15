import axios from "axios";
import { getConfig } from "../config";

const AxiosClient = () => {
  const axiosInstance = axios.create({
    httpsAgent: getConfig.agentOptions,
  });
  axiosInstance.interceptors.request.use((request) => {
    return request;
  });
  return axiosInstance;
};

export default AxiosClient();
