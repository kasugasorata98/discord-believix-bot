import { Types } from "mongoose";
import MongooseClient from "../lib/MongooseClient";
import { Functionality } from "../models/Functionality";
import { Util } from "../utils/Util";

(async () => {
    try {
        await MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot');
        const functionId = await Util.askQuestion('Function Id: ');
        const function_ = await Functionality.findById(functionId);
        while (true) {
            const channelId = await Util.askQuestion('Channel Id: ');
            function_?.channelIds.push(new Types.ObjectId(channelId));
            await function_?.save();
        }
    }
    catch (err: any) {
        console.log(err);
    }
})()