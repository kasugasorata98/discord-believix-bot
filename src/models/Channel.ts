import mongoose, { Schema } from "mongoose";

export interface Channel {
    channelId: string;
    channelName: string;
    guildId?: mongoose.Types.ObjectId
}

export const Channel = mongoose.model(
    "Channel",
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
        },
        {
            timestamps: true,
        }
    )
);
