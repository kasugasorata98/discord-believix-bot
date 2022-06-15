import { Config } from "./index";

const development = (): Config => {
  return {
    environment: process.env.NODE_ENV || "development",
    discordToken: process.env.DISCORD_TOKEN || "",
    cloudTranslationApi: process.env.CLOUD_TRANSLATION_API || "",
    cloudTranslationProject: process.env.CLOUD_TRANSLATION_PROJECT || "",
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || "",
    agentOptions: undefined,
  };
};

export default development;
