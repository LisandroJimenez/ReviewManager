import { Schema, model } from "mongoose";

 const CategorySchema = Schema (
    {
        category : {
            type: String,
            required: [true, 'The category es required']
        },
        status: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model('Category', CategorySchema);