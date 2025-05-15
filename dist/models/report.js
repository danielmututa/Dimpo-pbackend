"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchema = exports.reportTypeEnum = void 0;
const zod_1 = require("zod");
exports.reportTypeEnum = zod_1.z.enum([
    "monthly",
    "annual",
    "financial",
    "user_activity",
    "inventory",
    "custom"
]);
exports.reportSchema = zod_1.z.object({
    report_type: exports.reportTypeEnum.optional(),
    report_content: zod_1.z.string().optional(),
    report_date: zod_1.z.date().optional()
});
//# sourceMappingURL=report.js.map