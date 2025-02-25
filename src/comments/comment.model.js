import { Schema, model } from "mongoose";

const CommentSchema = Schema({
    description: {
        type: String,
        required: true
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'publication',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true,
    versionKey: false,

}
)

export default model ('Comment', CommentSchema)