import development from "./development";
import production from "./production";
import staging from "./staging";
import https from "node:https";
import dotenv from "dotenv";
dotenv.config();

export interface Config {
  discordToken: string;
  mongoDBString: string;
  cloudTranslationApi: string;
  cloudTranslationProject: string;
  environment: string;
  agentOptions?: https.AgentOptions;
}

export const getConfig = (() => {
  switch (process.env.NODE_ENV || "development") {
    case "prod":
    case "production": {
      return production();
    }
    case "stag":
    case "staging": {
      return staging();
    }
    case "dev":
    case "development": {
      return development();
    }
    default: {
      return development();
    }
  }
})();
