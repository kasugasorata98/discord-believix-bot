import MongooseClient from "../lib/MongooseClient";
import { Guild } from "../models/Guild";

(async () => {
    try {
        await MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot');
        const function_ = await Guild.findOne().populate('functionalities');
        console.log(function_);
    }
    catch (err: any) {
        console.log(err);
    }
})()