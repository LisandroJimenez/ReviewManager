import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { getPublication, savePublication, updatePublication } from "./publication.controller.js";

const router = Router();

router.post(
    "/",
    [
        validateJWT,
        check("id", "not a valid ID").isMongoId(),
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

export default router;