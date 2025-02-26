import Publication from "../publications/publication.model.js";
import Comment from "./comment.model.js";
import User from "../users/user.model.js";

export const saveComment = async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 

    try {
        const publication = await Publication.findById(id);  
        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publication not found',
            });
        }
        const userId = req.usuario?.id; 
        if (!userId) {
            return res.status(404).json({
                success: false,
                msg: 'User not found',
            });
        }
        if (!data.description) {
            return res.status(400).json({
                success: false,
                msg: 'Comment description is required',
            });
        }
        const comment = new Comment({
            ...data,
            publication: id,  
            user: userId     
        });
        await comment.save();  
        publication.comments.push(comment._id); 
        await publication.save(); 

        res.status(201).json({
            success: true,
            msg: 'Comment saved and publication updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error saving comment',
            error: error.message || error,
        });
    }
};



export const getComment = async (req, res) => {
    const { limit = 10, since = 0 } = req.query;
    const query = { status: true };

    try {
        const comments = await Comment.find(query)
            .skip(Number(since))
            .limit(Number(limit))
            .populate({
                path: 'user',
                select: 'name -_id',
            })
            .populate({
                path: 'publication',
                select: 'title -_id',
                match: {status: true}
            })


        const total = await Comment.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting comments',
            error: error.message || error,
        });
    }
};



export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.usuario.id; 
        const data = req.body; 
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comment not found',
            });
        }
        if (comment.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                msg: 'You can only edit your own comments',
            });
        }
        const updatedComment = await Comment.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({
            success: true,
            msg: 'Comment Updated Successfully',
            comment: updatedComment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating comment',
            error: error.message,
        });
    }
};



export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.usuario.id;  
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comment not found'
            });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                msg: 'You can only delete your own comments'
            });
        }
        await Comment.findByIdAndUpdate(id, { status: false });
        res.status(200).json({
            success: true,
            msg: 'Comment removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting comment',
            error: error.message
        });
    }
};





 
