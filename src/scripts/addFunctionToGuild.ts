import mongoose from "mongoose";
import MongooseClient from "../lib/MongooseClient";
import { Functionality } from "../models/Functionality";
import { Guild } from "../models/Guild";
import { Util } from "../utils/Util";

(async () => {
    try {
        await MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot');
        const guildId = await Util.askQuestion('Guild id: ');
        while (true) {
            const functionId = await Util.askQuestion('Function id: ');
            const guild = await Guild.findById(guildId);
            if (!guild) {
                console.log('Guild does not eixst');
                continue;
            }
            guild?.functionalities.push(new mongoose.Types.ObjectId(functionId));
            const functionality = await Functionality.findById(functionId);
            if (!functionality) {
                console.log('Function does not eixst');
                continue;
            }
            functionality.guildIds.push(guild._id);
            await guild.save();
            await functionality.save();
        }
    }
    catch (err: any) {
        console.log(err);
    }
})()