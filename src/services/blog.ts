import { PrismaClient, Prisma } from "@prisma/client";
import { blogSchema, blogImageSchema } from "../models/blogs";
import { z } from "zod";

const prisma = new PrismaClient();

export const BlogService = {
  // Create blog
  async createBlog(data: z.infer<typeof blogSchema>) {
    const validated = blogSchema.parse(data);

    return await prisma.$transaction(async (tx) => {
      const blogData: Prisma.blogsCreateInput = {
        title: validated.title,
        description: validated.description,
        content: validated.content,
        image_url: validated.image_url ?? null,
        hero_image: validated.hero_image ?? null,
        blog_image_one: validated.blog_image_one ?? null,
        blog_image_two: validated.blog_image_two ?? null,
        blog_image_three: validated.blog_image_three ?? null,
        author_avatar: validated.author_avatar ?? null,
        epigraph: validated.epigraph ?? null,
        first_paragraph: validated.first_paragraph ?? null,
        second_paragraph: validated.second_paragraph ?? null,
        third_paragraph: validated.third_paragraph ?? null,
        fourth_paragraph: validated.fourth_paragraph ?? null,
        fifth_paragraph: validated.fifth_paragraph ?? null,
        annotation_image_one: validated.annotation_image_one ?? null,
        annotation_image_two: validated.annotation_image_two ?? null,
        annotation_image_three: validated.annotation_image_three ?? null,
        annotation_image_four: validated.annotation_image_four ?? null,
        annotation_image_five: validated.annotation_image_five ?? null,
        point_one_title: validated.point_one_title ?? null,
        point_two_title: validated.point_two_title ?? null,
        point_three_title: validated.point_three_title ?? null,
        point_four_title: validated.point_four_title ?? null,
        point_five_title: validated.point_five_title ?? null,
        point_one_description: validated.point_one_description ?? null,
        point_two_description: validated.point_two_description ?? null,
        point_three_description: validated.point_three_description ?? null,
        point_four_description: validated.point_four_description ?? null,
        point_five_description: validated.point_five_description ?? null,
        categories: validated.categories ?? null,
        more_blogs: validated.more_blogs ?? null,
        meta_description: validated.meta_description ?? null,
        keywords: validated.keywords ?? null,
        meta_author: validated.meta_author ?? null,
        meta_og_title: validated.meta_og_title ?? null,
        meta_og_url: validated.meta_og_url ?? null,
        meta_og_image: validated.meta_og_image ?? null,
        meta_facebook_id: validated.meta_facebook_id ?? null,
        meta_site_name: validated.meta_site_name ?? null,
        meta_post_twitter: validated.meta_post_twitter ?? null,
        status: validated.status ?? "visible",
      };

      const createdBlog = await tx.blogs.create({ data: blogData });

      if (validated.blog_images?.length) {
        await tx.blog_images.createMany({
          data: validated.blog_images.map((img) => ({
            blog_id: createdBlog.id,
            image_url: img.image_url,
          })),
        });
      }

      return await tx.blogs.findUnique({
        where: { id: createdBlog.id },
        include: { blog_images: true },
      });
    });
  },

  // Get single blog
  async getBlogById(id: number) {
    return prisma.blogs.findUnique({
      where: { id },
      include: { blog_images: true },
    });
  },

  // Get all blogs (paginated)
  async getAllBlogs(page = 1, limit = 10, status?: "visible" | "hidden" | "draft") {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [blogs, total] = await Promise.all([
      prisma.blogs.findMany({
        where,
        skip,
        take: limit,
        include: { blog_images: true },
        orderBy: { created_at: "desc" },
      }),
      prisma.blogs.count({ where }),
    ]);

    return {
      data: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Update blog
  async updateBlog(id: number, data: Partial<z.infer<typeof blogSchema>>) {
    const validated = blogSchema.partial().parse(data);

    return await prisma.$transaction(async (tx) => {
      // Build update data object
      const updateData: Prisma.blogsUpdateInput = {};

      // Helper to set fields safely
      const setField = <K extends keyof typeof validated>(
        field: K,
        value: typeof validated[K]
      ) => {
        if (value !== undefined) {
          // @ts-ignore - Prisma types are complex here
          updateData[field] = value;
        }
      };

      // Set all fields that might be updated
      setField('title', validated.title);
      setField('description', validated.description);
      setField('content', validated.content);
      setField('image_url', validated.image_url);
      setField('hero_image', validated.hero_image);
      setField('blog_image_one', validated.blog_image_one);
      setField('blog_image_two', validated.blog_image_two);
      setField('blog_image_three', validated.blog_image_three);
      setField('author_avatar', validated.author_avatar);
      setField('epigraph', validated.epigraph);
      setField('first_paragraph', validated.first_paragraph);
      setField('second_paragraph', validated.second_paragraph);
      setField('third_paragraph', validated.third_paragraph);
      setField('fourth_paragraph', validated.fourth_paragraph);
      setField('fifth_paragraph', validated.fifth_paragraph);
      setField('annotation_image_one', validated.annotation_image_one);
      setField('annotation_image_two', validated.annotation_image_two);
      setField('annotation_image_three', validated.annotation_image_three);
      setField('annotation_image_four', validated.annotation_image_four);
      setField('annotation_image_five', validated.annotation_image_five);
      setField('point_one_title', validated.point_one_title);
      setField('point_two_title', validated.point_two_title);
      setField('point_three_title', validated.point_three_title);
      setField('point_four_title', validated.point_four_title);
      setField('point_five_title', validated.point_five_title);
      setField('point_one_description', validated.point_one_description);
      setField('point_two_description', validated.point_two_description);
      setField('point_three_description', validated.point_three_description);
      setField('point_four_description', validated.point_four_description);
      setField('point_five_description', validated.point_five_description);
      setField('categories', validated.categories);
      setField('more_blogs', validated.more_blogs);
      setField('meta_description', validated.meta_description);
      setField('keywords', validated.keywords);
      setField('meta_author', validated.meta_author);
      setField('meta_og_title', validated.meta_og_title);
      setField('meta_og_url', validated.meta_og_url);
      setField('meta_og_image', validated.meta_og_image);
      setField('meta_facebook_id', validated.meta_facebook_id);
      setField('meta_site_name', validated.meta_site_name);
      setField('meta_post_twitter', validated.meta_post_twitter);
      setField('status', validated.status);

      const updatedBlog = await tx.blogs.update({
        where: { id },
        data: updateData,
      });

      if (validated.blog_images) {
        await tx.blog_images.deleteMany({ where: { blog_id: id } });

        if (validated.blog_images.length > 0) {
          await tx.blog_images.createMany({
            data: validated.blog_images.map((img) => ({
              blog_id: id,
              image_url: img.image_url,
            })),
          });
        }
      }

      return await tx.blogs.findUnique({
        where: { id },
        include: { blog_images: true },
      });
    });
  },

  // Delete blog
  async deleteBlog(id: number) {
    return prisma.blogs.delete({ where: { id } });
  },

  // Blog Images Helpers
  async addBlogImage(blogId: number, imageUrl: string) {
    return prisma.blog_images.create({
      data: {
        image_url: imageUrl,
        blogs: { connect: { id: blogId } },
      },
    });
  },

  async getBlogImages(blogId: number) {
    return prisma.blog_images.findMany({ where: { blog_id: blogId } });
  },

  async deleteBlogImage(imageId: number) {
    return prisma.blog_images.delete({ where: { id: imageId } });
  },
};