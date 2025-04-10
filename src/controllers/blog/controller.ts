import { FastifyRequest, FastifyReply } from 'fastify';
import { BlogService } from '../../services/blog';
import { 
  blogSchema,
  BlogSchemaType,
  BlogImageSchemaType,
  blogImageSchema
} from '../../models/blogs';
import { z } from 'zod';

// Type definitions for request parameters
type BlogParams = {
  id: string;
};

type BlogImageParams = {
  id: string;
  imageId?: string;
};

type BlogQuery = {
  page?: string;
  limit?: string;
  status?: "visible" | "hidden" | "draft";
};

type BlogBody = z.infer<typeof blogSchema>;
type BlogImageBody = z.infer<typeof blogImageSchema>;

export const BlogController = {
  // Get all blogs with pagination
  async getAllBlogs(
    request: FastifyRequest<{ Querystring: BlogQuery }>,
    reply: FastifyReply
  ) {
    try {
      const { page = '1', limit = '10', status } = request.query;
      
      const blogs = await BlogService.getAllBlogs(
        parseInt(page),
        parseInt(limit),
        status
      );
      
      reply.send(blogs);
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error fetching blogs',
        error: (error as Error).message 
      });
    }
  },

  // Get a single blog by ID
  async getBlogById(
    request: FastifyRequest<{ Params: BlogParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const blog = await BlogService.getBlogById(parseInt(id));
      
      if (!blog) {
        reply.status(404).send({ message: 'Blog not found' });
        return;
      }
      
      reply.send(blog);
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error fetching blog',
        error: (error as Error).message 
      });
    }
  },

  // Create a new blog
  async createBlog(
    request: FastifyRequest<{ Body: BlogBody }>,
    reply: FastifyReply
  ) {
    try {
      const blog = await BlogService.createBlog(request.body);
      reply.status(201).send(blog);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Invalid blog data',
        error: (error as Error).message 
      });
    }
  },

  // Update an existing blog
  async updateBlog(
    request: FastifyRequest<{ 
      Params: BlogParams;
      Body: Partial<BlogBody> 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const updatedBlog = await BlogService.updateBlog(
        parseInt(id), 
        request.body
      );
      
      if (!updatedBlog) {
        reply.status(404).send({ message: 'Blog not found' });
        return;
      }
      
      reply.send(updatedBlog);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Error updating blog',
        error: (error as Error).message 
      });
    }
  },

  // Delete a blog
  async deleteBlog(
    request: FastifyRequest<{ Params: BlogParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      await BlogService.deleteBlog(parseInt(id));
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error deleting blog',
        error: (error as Error).message 
      });
    }
  },

  // Blog Images Controllers
  async addBlogImage(
    request: FastifyRequest<{ 
      Params: BlogParams;
      Body: { image_url: string } 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const { image_url } = request.body;
      
      const image = await BlogService.addBlogImage(parseInt(id), image_url);
      reply.status(201).send(image);
    } catch (error) {
      reply.status(400).send({ 
        message: 'Invalid image data',
        error: (error as Error).message 
      });
    }
  },

  async getBlogImages(
    request: FastifyRequest<{ Params: BlogParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const images = await BlogService.getBlogImages(parseInt(id));
      reply.send(images);
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error fetching blog images',
        error: (error as Error).message 
      });
    }
  },

  async deleteBlogImage(
    request: FastifyRequest<{ 
      Params: { blogId: string; imageId: string } 
    }>,
    reply: FastifyReply
  ) {
    try {
      const { blogId, imageId } = request.params;
      await BlogService.deleteBlogImage(parseInt(imageId));
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ 
        message: 'Error deleting blog image',
        error: (error as Error).message 
      });
    }
  },
};