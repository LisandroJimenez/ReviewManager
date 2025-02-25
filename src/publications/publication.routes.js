import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { getPublication, savePublication, updatePublication, deletePublication } from "./publication.controller.js";

const router = Router();

router.post(
    "/",
    [
        validateJWT,
        validateFields
    ],
    savePublication
)

router.get("/", getPublication)

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    updatePublication
)

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    deletePublication
)

export default router;