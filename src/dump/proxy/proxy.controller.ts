import { TextChannel } from "discord.js";
import DiscordClient from "../../lib/DiscordClient";
import ProxyService from "./proxy.service";
import puppeteer from "puppeteer-extra";
import { PuppeteerExtraPluginRecaptcha } from "puppeteer-extra-plugin-recaptcha";
import { Constants } from "../../constants";

class ProxyController extends DiscordClient {
  proxyService: ProxyService;
  constructor() {
    super();
    this.proxyService = new ProxyService();
  }

  async handleProxy(): Promise<void> {
    puppeteer.use(
      new PuppeteerExtraPluginRecaptcha({
        provider: {
          id: process.env.PUPPETEER_RECAPTCHA_ID,
          token: process.env.PUPPETEER_RECAPTCHA_TOKEN, // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
        },
        visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
      })
    );
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(
      "https://discord.com/channels/296590733790543872/824924954641825792"
    );
    // await page.screenshot({ path: 'example.png' });
    await page.waitForTimeout(1000);
    await page.click(".marginTop8-24uXGp");
    await page.waitForTimeout(1000);
    await page.type('input[name="email"]', "buttdevine@gmail.com");
    await page.type('input[name="password"]', "PokeFan6");
    await page.click('button[type="submit"]');
    // const captcha = await page.solveRecaptchas();
    // if (captcha.error) {
    //   return console.log(captcha.error);
    // } else if (captcha.solved.length > 0) {
    //   console.log(captcha);
    // }
    await page.waitForSelector(".name-3Uvkvr");
    let oldMessages: string[] = [];
    let isFirstTime = true;
    setInterval(async () => {
      const newMessages = await page.evaluate(() => {
        let elements: Element[] = Array.from(
          document.querySelectorAll(
            ".messageListItem-ZZ7v6g"
          ) as NodeListOf<HTMLElement>
        );
        let msgs = elements.map((element) => {
          return (element as HTMLElement).innerText;
        });
        return msgs;
      });
      oldMessages = [...oldMessages, ...newMessages];
      let confirmedNewMessages = oldMessages.filter(function (item) {
        return oldMessages.lastIndexOf(item) == oldMessages.indexOf(item);
      });
      if (isFirstTime) {
        isFirstTime = false;
        return;
      }
      const sesameProxyChannel: TextChannel = this.getChannelByName(
        Constants.CHANNEL.SESAME_PROXY
      ) as TextChannel;

      for (let newMessage of confirmedNewMessages) {
        const filtered = newMessage.replace(/\n/g, " ");
        console.log(filtered);
        await sesameProxyChannel.send({
          content: newMessage,
        });
      }
    }, 5000);
  }
}

export default ProxyController;
