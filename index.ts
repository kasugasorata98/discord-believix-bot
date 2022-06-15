import BotController from "./src/controllers/BotController";
import mongoose from "mongoose";

async function main() {
  mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING || "")
    .then(async (res) => {
      console.log("MongoDB connected to " + res.connections[0].name);
      const botController = new BotController();
      botController.init();
    })
    .catch((err) => {
      console.log(err);
    });
}

main();

process.on("uncaughtException", async (error) => {
  console.log(error);
});
