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
        category: {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            required: true
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default model("Publication", PublicationSchema)
