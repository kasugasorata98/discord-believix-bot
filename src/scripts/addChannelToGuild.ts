import MongooseClient from "../lib/MongooseClient";
import { Channel } from "../models/Channel";
import { Guild } from "../models/Guild";
import { Util } from "../utils/Util";

(async () => {
    try {
        await MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot');
        const guildId = await Util.askQuestion('Guild Id: ');
        const guild = await Guild.findById(guildId);
        while (true) {
            const channelName = await Util.askQuestion('Channel Name: ');
            const channelId = await Util.askQuestion('Channel Id: ');
            const channel = await Channel.create({
                guildId: guild?._id,
                channelId: channelId,
                channelName: channelName,
            })
            guild?.channelIds.push(channel._id);
            await channel.save();
            await guild?.save();
        }
    }
    catch (err: any) {
        console.log(err);
    }
})()