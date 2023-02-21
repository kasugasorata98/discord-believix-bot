import { Config } from "./index";
import https from "node:https";
import fs from "fs";

const staging = (): Config => {
  return {
    environment: process.env.NODE_ENV || "staging",
    discordToken: process.env.DISCORD_TOKEN || "",
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || "",
    OPENAI_KEY: process.env.OPENAI_KEY || "",
    OPENAI_ORG: process.env.OPENAI_ORG || "",
    agentOptions: new https.Agent({
      key: fs.readFileSync(
        "/etc/letsencrypt/live/kasugasorata.monster/privkey.pem",
        "utf8"
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/kasugasorata.monster/cert.pem",
        "utf8"
      ),
    }),
  };
};

export default staging;
