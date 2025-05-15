"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = exports.blogTypeSchema = exports.blogImageSchema = void 0;
const zod_1 = require("zod");
// Schema for blog images
exports.blogImageSchema = zod_1.z.object({
    blog_id: zod_1.z.number().int().positive().optional(),
    image_url: zod_1.z.string().url(),
});
// Schema for blog types
exports.blogTypeSchema = zod_1.z.object({
    name: zod_1.z.string().max(100),
    image_url: zod_1.z.string().url().optional().nullable(),
    description: zod_1.z.string().optional().nullable(),
});
// Main blog schema
exports.blogSchema = zod_1.z.object({
    title: zod_1.z.string().max(255),
    description: zod_1.z.string(),
    content: zod_1.z.string(),
    image_url: zod_1.z.string().url().optional().nullable(),
    //   author_id: z.number().int().positive().optional().nullable(),
    //   blog_type_id: z.number().int().positive().optional().nullable(),
    created_at: zod_1.z.coerce.date().optional(),
    hero_image: zod_1.z.string().url().optional().nullable(),
    blog_image_one: zod_1.z.string().url().optional().nullable(),
    blog_image_two: zod_1.z.string().url().optional().nullable(),
    blog_image_three: zod_1.z.string().url().optional().nullable(),
    author_avatar: zod_1.z.string().url().optional().nullable(),
    epigraph: zod_1.z.string().optional().nullable(),
    first_paragraph: zod_1.z.string().optional().nullable(),
    second_paragraph: zod_1.z.string().optional().nullable(),
    third_paragraph: zod_1.z.string().optional().nullable(),
    fourth_paragraph: zod_1.z.string().optional().nullable(),
    fifth_paragraph: zod_1.z.string().optional().nullable(),
    annotation_image_one: zod_1.z.string().url().optional().nullable(),
    annotation_image_two: zod_1.z.string().url().optional().nullable(),
    annotation_image_three: zod_1.z.string().url().optional().nullable(),
    annotation_image_four: zod_1.z.string().url().optional().nullable(),
    annotation_image_five: zod_1.z.string().url().optional().nullable(),
    point_one_title: zod_1.z.string().max(255).optional().nullable(),
    point_one_description: zod_1.z.string().optional().nullable(),
    point_two_title: zod_1.z.string().max(255).optional().nullable(),
    point_two_description: zod_1.z.string().optional().nullable(),
    point_three_title: zod_1.z.string().max(255).optional().nullable(),
    point_three_description: zod_1.z.string().optional().nullable(),
    point_four_title: zod_1.z.string().max(255).optional().nullable(),
    point_four_description: zod_1.z.string().optional().nullable(),
    point_five_title: zod_1.z.string().max(255).optional().nullable(),
    point_five_description: zod_1.z.string().optional().nullable(),
    categories: zod_1.z.string().max(255).optional().nullable(),
    more_blogs: zod_1.z.string().optional().nullable(),
    meta_description: zod_1.z.string().optional().nullable(),
    keywords: zod_1.z.string().optional().nullable(),
    meta_author: zod_1.z.string().max(255).optional().nullable(),
    meta_og_title: zod_1.z.string().max(255).optional().nullable(),
    meta_og_url: zod_1.z.string().url().optional().nullable(),
    meta_og_image: zod_1.z.string().url().optional().nullable(),
    meta_facebook_id: zod_1.z.string().optional().nullable(),
    meta_site_name: zod_1.z.string().optional().nullable(),
    meta_post_twitter: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(["visible", "hidden", "draft"]).default("visible").optional(),
    blog_images: zod_1.z.array(exports.blogImageSchema).optional(), // For handling multiple images
});
//# sourceMappingURL=blogs.js.map