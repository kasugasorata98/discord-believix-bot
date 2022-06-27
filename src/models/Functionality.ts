import mongoose, { Schema } from "mongoose";

interface Functionality {
    function: string;
}

const schema =
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

const Functionality = mongoose.model('Functionality', schema);
export default Functionality;
