import mongoose, { Schema } from "mongoose";
import { Channel } from "./Channel";
import { Functionality } from "./Functionality";

export interface Guild {
    name: string;
    guildId: string;
    functionalities: mongoose.Types.ObjectId[];
    channels: mongoose.Types.ObjectId[];
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
            functionalities: [
                {
                    type: mongoose.Types.ObjectId,
                    ref: Functionality
                }
            ],
            channels: [
                {
                    type: mongoose.Types.ObjectId,
                    ref: Channel
                }
            ]
        },
        {
            timestamps: true,
        }
    )
);
