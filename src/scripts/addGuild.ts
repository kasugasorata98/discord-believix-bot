import MongooseClient from "../lib/MongooseClient";
import { Guild } from "../models/Guild";
import { Util } from "../utils/Util";

(async () => {
    try {
        await MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot');
        const name = await Util.askQuestion('Guild name: ');
        const guildId = await Util.askQuestion('Guild Id: ');
        const res = await Guild.create({
            name,
            guildId
        })
        console.log(res);
        process.exit();
    }
    catch (err: any) {
        console.log(err);
    }
})()