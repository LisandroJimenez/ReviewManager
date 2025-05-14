import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { getPublication, savePublication, updatePublication, deletePublication } from "./publication.controller.js";

const router = Router();

router.post(
    "/",
    [
        validateFields
    ],
    savePublication
)

router.get("/", getPublication)

router.put(
    "/:id",
    [
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    updatePublication
)

router.delete(
    "/:id",
    [
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    deletePublication
)

export default router;