import { Config } from "./index";
import https from "node:https";
import fs from "fs";

const production = (): Config => {
  return {
    environment: process.env.NODE_ENV || "production",
    discordToken: process.env.DISCORD_TOKEN || "",
    cloudTranslationApi: process.env.CLOUD_TRANSLATION_API || "",
    cloudTranslationProject: process.env.CLOUD_TRANSLATION_PROJECT || "",
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || "",
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

export default production;
