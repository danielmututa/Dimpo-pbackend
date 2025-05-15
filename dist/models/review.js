"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    // id: z.number(),
    user_id: zod_1.z.number().nullable().optional(),
    product_id: zod_1.z.number().nullable().optional(),
    rating: zod_1.z.number().nullable().optional(),
    comment: zod_1.z.string().nullable().optional(),
    created_at: zod_1.z.coerce.date().optional()
});
//# sourceMappingURL=review.js.map