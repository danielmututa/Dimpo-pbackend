import { FastifyInstance } from 'fastify';
import  {BlogController} from '../controllers/blog/controller';
import { blogSchema, blogImageSchema } from '../models/blogs';
import { zodToJsonSchema } from '../utils/schemas';

export default async (app: FastifyInstance) => {
  // Get all blogs with pagination and status filter
  app.get('/', BlogController.getAllBlogs);
  // Example: http://localhost:3000/api/blogs?page=1&limit=5&status=visible

  // Get single blog by ID
  app.get('/:id', BlogController.getBlogById);
  // Example: http://localhost:3000/api/blogs/3

  // Create new blog
  app.post('/newblog', {
    handler: BlogController.createBlog,
    schema: {
      body: zodToJsonSchema(blogSchema)
    }
  });

  // Update blog
  app.put('/:id', {
    handler: BlogController.updateBlog,
    schema: {
      body: zodToJsonSchema(blogSchema.partial())
    }
  });

  // Delete blog
  app.delete('/:id', BlogController.deleteBlog);

  // Blog Images routes
  app.post('/:id/images', {
    handler: BlogController.addBlogImage,
    schema: {
      body: zodToJsonSchema(blogImageSchema.omit({  blog_id: true }))
    }
  });

  // Example: POST http://localhost:3000/api/blogs/5/images

  // Get all images for a blog
  app.get('/:id/images', BlogController.getBlogImages);
  // Example: http://localhost:3000/api/blogs/5/images

  // Delete a blog image
  app.delete('/:blogId/images/:imageId', BlogController.deleteBlogImage);
  // Example: DELETE http://localhost:3000/api/blogs/5/images/10
};