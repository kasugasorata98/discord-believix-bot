import MongooseClient from "../lib/MongooseClient";
import { Functionality } from "../models/Functionality";
import { Util } from "../utils/Util";

(async () => {
    try {
        await MongooseClient.connect('mongodb+srv://jeromy:PokeFan2@staging.2wi4b.mongodb.net/believix-bot');
        while (true) {
            const function_ = await Util.askQuestion('Function: ');
            const res = await Functionality.create({
                function: function_
            })
            console.log(res);
        }
    }
    catch (err: any) {
        console.log(err);
    }
})()