import Category from "../categories/category.model.js";
import Publication from "./publication.model.js";

export const savePublication = async (req, res) => {
    try {
        const { categoryId, ...restData } = req.body;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: 'Category not found'
            });
        }
        const publication = new Publication({
            ...restData,
            category: category._id
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
    const { limit = 10, since = 0, categoryId, title } = req.query;
    const query = { status: true };

    if (categoryId) {
        query.category = categoryId;
    }

    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }

    try {
        const publications = await Publication.find(query)
            .skip(Number(since))
            .limit(Number(limit))
            .populate({
                path: 'comments',
                match: { status: true }
            });

        const publicationWithCategoryNames = await Promise.all(publications.map(async (publication) => {
            let categoryName = "General";
            const category = await Category.findOne({ _id: publication.category, status: true });
            if (category) {
                categoryName = category.name;
            }

            return {
                ...publication.toObject(),
                category: categoryName
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
    try {
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publication not found',
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

    try {
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publication not found',
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
