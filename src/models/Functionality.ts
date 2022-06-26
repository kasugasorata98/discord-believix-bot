import mongoose, { Schema } from "mongoose";

export interface Functionality {
    function: string;
    guildIds: mongoose.Types.ObjectId[],
    channelIds: mongoose.Types.ObjectId[],
}

export const Functionality = mongoose.model(
    "Functionality",
    new Schema<Functionality>(
        {

            function: {
                type: String,
                required: true,
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    )
);
