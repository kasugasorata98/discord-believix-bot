import mongoose, { Schema } from "mongoose";

export interface Name {
  name: string;
  isEnemy: boolean;
}

export const Name = mongoose.model(
  "name",
  new Schema<Name>(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      isEnemy: {
        type: Boolean,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);
