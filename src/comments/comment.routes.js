import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { deleteComment, getComment, saveComment, updateComment } from "./comment.controller.js";

const router = Router();

router.post(
    "/:id",
    [
        validateJWT,
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
        validateJWT,
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    updateComment
)

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    deleteComment
)
export default router