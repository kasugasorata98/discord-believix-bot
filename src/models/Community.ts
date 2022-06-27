import mongoose, { Schema } from "mongoose";

interface Community {
  name: string;
  isEnemy: boolean;
}

export const Community = mongoose.model(
  "Community",
  new Schema<Community>(
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
