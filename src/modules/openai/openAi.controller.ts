import { Configuration, OpenAIApi } from "openai";
import { config } from "../../config";

class OpenAiController {
  private openai: OpenAIApi;
  constructor() {
    const configuration = new Configuration({
      organization: config.OPENAI_ORG,
      apiKey: config.OPENAI_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  getOpenAIClient() {
    return this.openai;
  }

  async chat(message: string): Promise<string> {
    const gptResponse = await this.openai.createCompletion({
      model: "davinci",
      prompt: message,
      temperature: 0.9,
      max_tokens: 100,
      stop: ["stop", "enough"],
    });
    return gptResponse.data.choices[0].text || "";
  }
}

export default OpenAiController;
