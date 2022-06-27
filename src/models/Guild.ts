import mongoose, { PopulatedDoc, Schema } from "mongoose";
import Channel from "./Channel";

export interface Guild {
    name: string;
    guildId: string;
    channels: PopulatedDoc<Channel>[] | Schema.Types.ObjectId[] | [];
}

export const Guild = mongoose.model(
    "Guild",
    new Schema<Guild>(
        {
            name: {
                type: String,
                required: true,
                unique: true,
            },
            guildId: {
                type: String,
                required: true,
                unique: true,
            },
            channels: [
                {
                    type: Schema.Types.ObjectId,
                    ref: Channel
                }
            ]
        },
        {
            timestamps: true,
        }
    )
);
