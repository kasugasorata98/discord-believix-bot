import { Config } from "./index";

const development = (): Config => {
  return {
    environment: process.env.NODE_ENV || "development",
    discordToken: process.env.DISCORD_TOKEN || "",
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || "",
    OPENAI_KEY: process.env.OPENAI_KEY || "",
    OPENAI_ORG: process.env.OPENAI_ORG || "",
    agentOptions: undefined,
  };
};

export default development;
