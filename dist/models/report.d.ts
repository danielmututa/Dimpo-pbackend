import { z } from "zod";
export declare const reportTypeEnum: z.ZodEnum<["monthly", "annual", "financial", "user_activity", "inventory", "custom"]>;
export declare const reportSchema: z.ZodObject<{
    report_type: z.ZodOptional<z.ZodEnum<["monthly", "annual", "financial", "user_activity", "inventory", "custom"]>>;
    report_content: z.ZodOptional<z.ZodString>;
    report_date: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    report_type?: "monthly" | "annual" | "financial" | "user_activity" | "inventory" | "custom" | undefined;
    report_content?: string | undefined;
    report_date?: Date | undefined;
}, {
    report_type?: "monthly" | "annual" | "financial" | "user_activity" | "inventory" | "custom" | undefined;
    report_content?: string | undefined;
    report_date?: Date | undefined;
}>;
export type Report = z.infer<typeof reportSchema>;
