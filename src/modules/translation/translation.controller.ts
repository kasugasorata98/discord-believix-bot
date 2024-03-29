import { Message } from "discord.js";
import TranslationService from "./translation.service";

class TranslationController {
  translationService: TranslationService;
  functionId: string;
  constructor() {
    this.functionId = '62b73ecb283607337e0d1924';
    this.translationService = new TranslationService();
  }

  async processTranslation(message: Message): Promise<void> {
    const detectedLanguage = await this.translationService.detectLanguage(
      message
    );
    console.log("Detected Language: ", detectedLanguage);
    if (
      detectedLanguage !== 'es' &&
      detectedLanguage !== 'pt'
    ) return;
    console.log("Translating to English...");
    const translation = await this.translationService.translateToEnglish(
      message
    );
    await this.sendTranslation(message, translation);
  }

  async sendTranslation(message: Message, translation: string) {
    await message.reply({
      content: `**Translation**: *${translation}*`,
    });
  }
}
export default TranslationController;
