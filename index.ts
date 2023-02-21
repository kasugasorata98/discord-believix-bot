// import { config } from "./src/config";
// import MongooseClient from "./src/lib/MongooseClient";
import BotController from "./src/modules/bot/bot.controller";

// MongooseClient
//   .connect(config.mongoDBString)
//   .then(async (res) => {
//     console.log("MongoDB connected to " + res.connections[0].name);

const botController = new BotController();
botController.init();
// })
// .catch((err) => {
//   console.log(err);
// });

process.on("uncaughtException", async (error) => {
  console.log(error);
});
