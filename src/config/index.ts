import development from "./development";
import production from "./production";
import staging from "./staging";
import https from "node:https";
import dotenv from "dotenv";
dotenv.config();

export interface Config {
  discordToken: string;
  mongoDBString: string;
  environment: string;
  OPENAI_KEY: string;
  OPENAI_ORG: string;
  agentOptions?: https.AgentOptions;
}

export const config = (() => {
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
