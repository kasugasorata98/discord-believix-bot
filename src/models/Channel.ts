import mongoose, { PopulatedDoc, Schema } from "mongoose";
import Functionality from "./Functionality";

interface Channel {
    channelId: string;
    channelName: string;
    functionalities: PopulatedDoc<Functionality>[] | Schema.Types.ObjectId[] | [];
}

const schema =
    new Schema<Channel>(
        {
            channelId: {
                type: String,
                required: true,
                unique: true,
            },
            channelName: {
                type: String,
                required: true,
            },
            functionalities: [{
                type: Schema.Types.ObjectId,
                ref: Functionality
            }]
        },
        {
            timestamps: true,
        }
    )

const Channel = mongoose.model('Channel', schema);
export default Channel;