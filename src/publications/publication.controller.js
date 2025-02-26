import Category from "../categories/category.model.js";
import Publication from "./publication.model.js";

export const savePublication = async (req, res) => {
    try {
        const { id, ...restData } = req.body;
        const userId = req.usuario.id; 
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: 'Category not found'
            });
        }
        const publication = new Publication({
            ...restData,
            category: category._id,
            user: userId,
        });

        await publication.save();

        res.status(201).json({
            success: true,
            msg: 'Publication saved successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error saving publication',
            error: error.message
        });
    }
};



export const getPublication = async (req, res) => {
    const { limit = 10, since = 0 } = req.query;
    const query = { status: true };

    try {
        const publications = await Publication.find(query)
            .skip(Number(since))
            .limit(Number(limit))
            .populate({
                path: 'comments',
                select: 'description user',
                match: { status: true },
                populate: {
                    path: 'user',
                    select: 'username -_id',
                }
            })
            .populate({
                path: 'user', 
                select: 'username -_id'
            });

        const publicationWithCategoryNames = await Promise.all(publications.map(async (publication) => {
            const category = await Category.findById(publication.category);
            let categoryName = "General";
            if (category && category.status) {
                categoryName = category.name;
            } else {
                const generalCategory = await Category.findOne({ name: "General" });
                if (generalCategory) {
                    categoryName = generalCategory.name;
                }
            }
            return {
                ...publication.toObject(),
                category: categoryName,
                user: publication.user?.username || "Unknown user"
            };
        }));

        const total = await Publication.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            publications: publicationWithCategoryNames,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error getting publications",
            error: error.message || error,
        });
    }
};



 


export const updatePublication = async (req, res) => {
    const { id } = req.params;
    const { _id, ...data } = req.body; 
    const userId = req.usuario.id; 
    try {
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publication not found',
            });
        }
        if (publication.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                msg: 'You are not authorized to update this publication',
            });
        }
        const updatedPublication = await Publication.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({
            success: true,
            msg: 'Publication updated successfully',
            publication: updatedPublication,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error updating publication',
            error: error.message,
        });
    }
};


export const deletePublication = async (req, res) => {
    const { id } = req.params;
    const userId = req.usuario.id;

    try {
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publication not found',
            });
        }
        if (publication.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                msg: 'You are not authorized to delete this publication',
            });
        }
        await Publication.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            msg: 'Publication removed successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error deleting publication',
            error: error.message,
        });
    }
};
