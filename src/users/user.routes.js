import { Router } from "express";
import { check } from "express-validator";
import { getUsers, updateUser } from "./user.controller.js";
import { existUserById } from "../helpers/db-validator.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.get("/", getUsers);


router.put(
    "/:id",
    [
        validateJWT,
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(existUserById),
        validateFields
    ],
    updateUser

)

export default router;