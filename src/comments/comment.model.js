import { Schema, model } from "mongoose";

const CommentSchema = Schema({
    user:{
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false,

}
)

export default model ('Comment', CommentSchema)