import https from "node:https";
import fs from "fs";
import axios from "axios";
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/kasugasorata.monster/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/kasugasorata.monster/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/kasugasorata.monster/chain.pem",
  "utf8"
);

const AxiosClient = () => {
  const axiosInstance = axios.create({
    httpsAgent:
      process.env.NODE_ENV === "staging" ||
      process.env.NODE_ENV === "production"
        ? new https.Agent({ ca: ca, cert: certificate, key: privateKey })
        : null,
  });
  return axiosInstance;
};

export default AxiosClient();
