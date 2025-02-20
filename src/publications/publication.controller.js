import Category from "../categories/category.model.js";
import Publication from "./publication.model.js";

export const savePublication = async (req, res) => {
    try {
        const data = req.body;
                const category = await Category.findById(data.id);
        if (!category) {
            return res.status(404).json({
                success: false, 
                msg: 'Category not found'
            });
        }
        const publication = new Publication({
            ...data,
            categoryK: category._id 
        });
        await publication.save();
        res.status(200).json({
            success: true,
            msg: 'Publication added successfully',
            publication
        });

    } catch (error) {
        console.error("Error saving publication:", error);
        res.status(500).json({
            success: false,
            msg: 'Error saving publication',
            error
        });
    }
};


export const getPublication = async (req, res) => {
    const { limit = 10, since = 0 } = req.query;
    const query = { status: true };

    try {
        const publications = await Publication.find(query)
            .skip(Number(since))
            .limit(Number(limit));

        const publicationWithCategoryNames = await Promise.all(
            publications.map(async (publication) => {
                if (!publication.categoryK) return { ...publication.toObject(), categoryK: "No category assigned" };

                const category = await Category.findById(String(publication.categoryK));

                return {
                    ...publication.toObject(),
                    categoryK: category ? category.category : "Category not found",
                };
            })
        );

        const total = await Publication.countDocuments(query);
        res.status(200).json({
            success: true,
            total,
            publications: publicationWithCategoryNames,
        });

    } catch (error) {
        console.error("Error getting publications:", error);
        res.status(500).json({
            success: false,
            msg: "Error getting publications",
            error,
        });
    }
};

export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data }  = req.body;
        const publication = await Publication.findByIdAndUpdate(id, data, {new: true})
        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publication not found'
            })
        }
        res.status(200).json({
            success: true,
            msg: 'Publication updated successfully',
            publication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating publication',
            error
        })
    }
}

