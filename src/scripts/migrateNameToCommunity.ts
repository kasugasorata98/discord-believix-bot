import MongooseClient from "../lib/MongooseClient";
import { Community } from "../models/Community";
import { Name } from "../models/Name";


(async () => {
    try {
        await MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot');
        const names = await Name.find().lean();
        for (const name of names) {
            await Community.create({
                ...name
            })
        }
        process.exit();
    }
    catch (err: any) {
        console.log(err);
    }
})()