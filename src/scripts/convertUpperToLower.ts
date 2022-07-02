import MongooseClient from "../lib/MongooseClient";
import { Community } from "../models/Community";

MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot').then(async () => {
    const community = await Community.find();
    for (const name of community) {
        name.name = name.name.toLocaleLowerCase();
        try {
            await name.save();
        }
        catch { }
    }
})