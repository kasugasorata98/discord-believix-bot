import axios from "axios";
import { getConfig } from "../config";

const AxiosClient = () => {
  const axiosInstance = axios.create({
    httpsAgent: getConfig.agentOptions,
  });
  return axiosInstance;
};

export default AxiosClient();
