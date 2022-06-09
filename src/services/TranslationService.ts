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
  async processMessage(message: Message): Promise<void> {
    const detectedLanguage = await this.detectLanguage(message);
    if (detectedLanguage !== "es") return;
    this.translateToEnglish(message);
  }
  async detectLanguage(message: Message): Promise<string> {
    const languageDetected = (await this.translate.detect(message.content))[0]
      .language as string;
    return languageDetected;
  }
  async translateToEnglish(message: Message): Promise<void> {
    const [translation] = await this.translate.translate(message.content, "en");
    await message.reply({
      content: `**Translation**: *${translation}*`,
    });
  }
}

export default TranslationService;
