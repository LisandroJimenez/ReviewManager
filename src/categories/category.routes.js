import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { deleteCategory, getCategories, saveCategory, updateCategories } from "./category.controller.js";

const router = Router();

router.get("/", getCategories )

router.post(
    "/",
    [
        validateFields
    ],
    saveCategory
)

router.put(
    "/:id",
    [
        check("id", "not is a valid ID").isMongoId(),
        validateFields
    ],
    updateCategories
)

router.delete(
    "/:id",
    [
        check("id", "not is a valid ID").isMongoId(),
        validateFields
    ],
    deleteCategory
)
export default router;