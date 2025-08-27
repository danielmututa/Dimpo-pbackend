import { FastifyRequest, FastifyReply } from 'fastify';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getUserCart,
  getAllProductImages,
  clearUserCart
} from '../../services/productservice';
import { productSchema } from '../../models/products';
import { z } from 'zod';
import { MultipartFile, MultipartFields } from '@fastify/multipart';
import { pipeline } from 'stream';
import util from 'util';
import fs from 'fs';
import path from 'path';

const pump = util.promisify(pipeline);

type ProductParams = {
  id: string;
};

type ProductBody = z.infer<typeof productSchema>;

export const createProductHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Parse multipart form data
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: 'No file or form data provided' });
    }

    // Extract form fields
    const fields = data.fields as MultipartFields;
    const formData: Record<string, any> = {};
    for (const key in fields) {
      const field = fields[key];
      if (field && 'value' in field && typeof field.value === 'string') {
        formData[key] = field.value;
      }
    }

    // Convert string fields to numbers for schema validation
    const convertedData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity, 10) : undefined,
      discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : undefined,
      views: formData.views ? parseInt(formData.views, 10) : undefined,
    };

    // Validate form fields against productSchema
    const validatedData = productSchema.parse(convertedData);

    // Handle file upload
    let fileInfo: { filename: string } | undefined;
    if (data.file) {
      const filename = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(__dirname, '../../Uploads', filename);
      await pump(data.file, fs.createWriteStream(filePath));
      fileInfo = { filename };
    }

    // Create product with validated data and file info
    const product = await createProduct(validatedData, fileInfo);
    reply.status(201).send(product);
  } catch (error) {
    console.error('Error creating product:', error);
    reply.status(400).send({ message: 'Invalid product data', error: JSON.stringify(error, null, 2) });
  }
};

export const getProductsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await getAllProducts();
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching products' });
  }
};




export const getProductImagesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const imageUrls = await getAllProductImages();
    reply.send(imageUrls);
  } catch (error) {
    console.error('Error fetching product images:', error);
    reply.status(500).send({ message: 'Error fetching product images' });
  }
};

// Get user's cart handler
export const getUserCartHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.id; // auth/session logic
    if (!userId) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const cartItems = await getUserCart(userId);
    reply.send(cartItems);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching cart items', error: (error as Error).message });
  }
};
export const deleteCartItemHandler = async (
  request: FastifyRequest<{ Params: { cartItemId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { cartItemId } = request.params;

    const userId = request.user?.id; // auth/session logic
    if (!userId) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const deletedItem = await deleteCartItem(parseInt(cartItemId), userId);
    if (!deletedItem) {
      reply.status(404).send({ message: 'Cart item not found' });
      return;
    }
    reply.send(deletedItem);
  } catch (error) {
    reply.status(500).send({ message: 'Error deleting cart item', error: (error as Error).message });
  }
}

// export const addProductToCartHandler = async (
//   request: FastifyRequest<{ Params: { userId: string }; Body: { productId: number; quantity: number } }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { userId } = request.params;
//     const { productId, quantity } = request.body;
//     const cartItem = await addProductToCart(parseInt(userId), productId, quantity, {});
//     if (!cartItem) {
//       reply.status(404).send({ message: 'Product not found' });
//       return;
//     }
//     reply.send(cartItem);
//   } catch (error) {
//     reply.status(500).send({ message: 'Error adding product to cart', error: (error as Error).message });
//   }
// };


export const addProductToCartHandler = async (
  request: FastifyRequest<{ Body: { productId: number; quantity: number } }>,
  reply: FastifyReply
) => {
  try {
    const { productId, quantity } = request.body;

    // Assume userId comes from auth/session
    const userId = request.user?.id; // replace with your auth logic
    if (!userId) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const cartItem = await addProductToCart(productId, quantity, userId);
    reply.send(cartItem);
  } catch (error) {
    reply.status(400).send({ message: 'Error adding product to cart', error: (error as Error).message });
  }
};

// Update cart item quantity handler
export const updateCartItemQuantityHandler = async (
  request: FastifyRequest<{ Params: { cartItemId: string }; Body: { quantity: number } }>,
  reply: FastifyReply
) => {
  try {
    const { cartItemId } = request.params;
    const { quantity } = request.body;

    const userId = request.user?.id; // auth/session logic
    if (!userId) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const updatedItem = await updateCartItemQuantity(parseInt(cartItemId), userId, quantity);
    if (!updatedItem) {
      reply.status(404).send({ message: 'Cart item not found' });
      return;
    }
    reply.send(updatedItem);
  } catch (error) {
    reply.status(500).send({ message: 'Error updating cart item quantity', error: (error as Error).message });
  }
};



// Clear user's cart handler
export const clearUserCartHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.id; // auth/session logic
    if (!userId) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }

    await clearUserCart(userId);
    reply.send({ message: 'Cart cleared successfully' });
  } catch (error) {
    reply.status(500).send({ message: 'Error clearing cart', error: (error as Error).message });
  }
};

export const getProductHandler = async (
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const product = await getProductById(parseInt(id));
    if (!product) {
      reply.status(404).send({ message: 'Product not found' });
      return;
    }
    reply.send(product);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching product' });
  }
};




export const updateProductHandler = async (
  request: FastifyRequest<{ Params: ProductParams; Body: Partial<ProductBody> }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const updatedProduct = await updateProduct(parseInt(id), request.body);
    if (!updatedProduct) {
      reply.status(404).send({ message: 'Product not found' });
      return;
    }
    reply.send(updatedProduct);
  } catch (error) {
    reply.status(400).send({ message: 'Error updating product', error });
  }
};

export const deleteProductHandler = async (
  request: FastifyRequest<{ Params: ProductParams }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    await deleteProduct(parseInt(id));
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ message: 'Error deleting product' });
  }
};