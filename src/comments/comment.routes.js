import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { deleteComment, getComment, saveComment, updateComment } from "./comment.controller.js";

const router = Router();

router.post(
    "/:id",
    [
        validateFields
    ],
    saveComment
)

router.get(
    "/",
    getComment
)

router.put(
    "/:id",
    [
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    updateComment
)

router.delete(
    "/:id",
    [
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    deleteComment
)
export default router