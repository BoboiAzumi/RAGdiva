import { Hono } from "hono";
import {
    deleteCriteria,
    getCriteria,
    getRootCriteria,
    patchCriteria,
    postCriteria,
} from "../handlers/criteria-handler.js";
import { AuthorizationMiddleware } from "../middleware/authorization-middleware.js";
import { ValidatorMiddleware } from "../middleware/validator-middleware.js";
import { CriteriaPostSchema } from "../schema/criteria-schema.js";

export const criteriaRoute = new Hono();

criteriaRoute.get(
    "/",
    AuthorizationMiddleware(["Admin", "User", "Asesor"]),
    getRootCriteria,
);
criteriaRoute.get(
    "/:id",
    AuthorizationMiddleware(["Admin", "User", "Asesor"]),
    getCriteria,
);
criteriaRoute.post(
    "/",
    AuthorizationMiddleware(["Admin", "User"]),
    ValidatorMiddleware(CriteriaPostSchema),
    postCriteria,
);
criteriaRoute.post(
    "/:id",
    AuthorizationMiddleware(["Admin", "User"]),
    ValidatorMiddleware(CriteriaPostSchema),
    postCriteria,
);
criteriaRoute.patch(
    "/:id",
    AuthorizationMiddleware(["Admin", "User"]),
    ValidatorMiddleware(CriteriaPostSchema),
    patchCriteria,
);
criteriaRoute.delete(
    "/:id",
    AuthorizationMiddleware(["Admin", "User"]),
    deleteCriteria,
);
