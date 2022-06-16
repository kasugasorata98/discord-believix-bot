import { Message } from "discord.js";
const { Translate } = require("@google-cloud/translate").v2;

class TranslationService {
  translate: any;
  constructor() {
    this.translate = new Translate({
      key: process.env.CLOUD_TRANSLATION_API,
      projectId: process.env.CLOUD_TRANSLATION_PROJECT,
    });
  }

  async detectLanguage(message: Message): Promise<string> {
    const languageDetected = (await this.translate.detect(message.content))[0]
      .language as string;
    return languageDetected;
  }
  async translateToEnglish(message: Message): Promise<string> {
    const [translation] = await this.translate.translate(message.content, "en");
    console.log("Translation: ", translation);
    return translation;
  }
}

export default TranslationService;
