import { Schema, model } from "mongoose";


const PublicationSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        categoryK: {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: true
        },
        user: {  
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model("Publication", PublicationSchema)
