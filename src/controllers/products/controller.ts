// import { FastifyRequest, FastifyReply } from 'fastify';
// import {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   addProductToCart,
//   updateCartItemQuantity,
//   deleteCartItem,
//   getUserCart
// } from '../../services/productservice';
// import { productSchema } from '../../models/products';
// import { z } from 'zod';


// type ProductParams = {
//   id: string;
// };

// type ProductBody = z.infer<typeof productSchema>;

// export const getProductsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const products = await getAllProducts();
//     reply.send(products);
//   } catch (error) {
//     reply.status(500).send({ message: 'Error fetching products' });
//   }
// };

// export const getUserCartHandler = async (
//   request: FastifyRequest<{ Params: { userId: string } }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { userId } = request.params;
//     const cartItems = await getUserCart(parseInt(userId));
    
//     if (!cartItems) {
//       reply.status(404).send({ message: 'Cart not found' });
//       return;
//     }
    
//     reply.send(cartItems);
//   } catch (error) {
//     reply.status(500).send({ message: 'Error fetching cart items' });
//   }
// }

// export const deleteCartItemHandler = async (
//   request: FastifyRequest<{ Params: { cartItemId: string; userId: string } }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { cartItemId, userId } = request.params;
//     const deletedItem = await deleteCartItem(parseInt(cartItemId), parseInt(userId));
    
//     if (!deletedItem) {
//       reply.status(404).send({ message: 'Cart item not found' });
//       return;
//     }
    
//     reply.send(deletedItem);
//   } catch (error) {
//     reply.status(500).send({ message: 'Error deleting cart item' });
//   }
// }


// // export const addProductToartHandler = async (
// //   request: FastifyRequest<{ Params: { userId: string }; Body: { productId: number; quantity: number } }>,
// //   reply: FastifyReply
// // ) => {
// //   try {
// //     const { userId } = request.params;
// //     const { productId, quantity } = request.body;
    
// //     const cartItem = await addProductToCart(parseInt(userId), productId, quantity );
    
// //     if (!cartItem) {
// //       reply.status(404).send({ message: 'Product not found' });
// //       return;
// //     }
    
// //     reply.send(cartItem);
// //   } catch (error) {
// //     reply.status(500).send({ message: 'Error adding product to cart' });
// //   }
// // }


// export const addProductToCartHandler = async (
//   request: FastifyRequest<{ Params: { userId: string }; Body: { productId: number; quantity: number } }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { userId } = request.params;
//     const { productId, quantity } = request.body;
    
//     const cartItem = await addProductToCart(parseInt(userId), productId, quantity, {}); // Pass empty object as data
    
//     if (!cartItem) {
//       reply.status(404).send({ message: 'Product not found' });
//       return;
//     }
    
//     reply.send(cartItem);
//   } catch (error) {
//     reply.status(500).send({ message: 'Error adding product to cart', error: (error as Error).message });
//   }
// };

// export const updateCartItemQuantityHandler = async (
//   request: FastifyRequest<{ Params: { cartItemId: string; userId: string }; Body: { quantity: number } }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { cartItemId, userId } = request.params;
//     const { quantity } = request.body;
    
//     const updatedItem = await updateCartItemQuantity(parseInt(cartItemId), parseInt(userId), quantity);
    
//     if (!updatedItem) {
//       reply.status(404).send({ message: 'Cart item not found' });
//       return;
//     }
    
//     reply.send(updatedItem);
//   } catch (error) {
//     reply.status(500).send({ message: 'Error updating cart item quantity' });
//   }
// }

// export const getProductHandler = async (
//   request: FastifyRequest<{ Params: ProductParams }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { id } = request.params;
//     const product = await getProductById(parseInt(id));
    
//     if (!product) {
//       reply.status(404).send({ message: 'Product not found' });
//       return;
//     }
    
//     reply.send(product);
//   } catch (error) {
//     reply.status(500).send({ message: 'Error fetching product' });
//   }
// };


// export const createProductHandler = async (
//   request: FastifyRequest<{ Body: ProductBody }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const product = await createProduct(request.body);
//     reply.status(201).send(product);
//   } catch (error) {
//     reply.status(400).send({ message: 'Invalid product data', error });
//   }
// };

// export const updateProductHandler = async (
//   request: FastifyRequest<{ Params: ProductParams; Body: Partial<ProductBody> }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { id } = request.params;
//     const updatedProduct = await updateProduct(parseInt(id), request.body);
    
//     if (!updatedProduct) {
//       reply.status(404).send({ message: 'Product not found' });
//       return;
//     }
    
//     reply.send(updatedProduct);
//   } catch (error) {
//     reply.status(400).send({ message: 'Error updating product', error });
//   }
// };

// export const deleteProductHandler = async (
//   request: FastifyRequest<{ Params: ProductParams }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { id } = request.params;
//     await deleteProduct(parseInt(id));
//     reply.status(204).send();
//   } catch (error) {
//     reply.status(500).send({ message: 'Error deleting product' });
//   }
// };







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
      const filename = `${Date.now()}-${data.filename}`;
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

// Other handlers (getProductsHandler, getUserCartHandler, etc.) remain unchanged
export const getProductsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await getAllProducts();
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching products' });
  }
};

export const getUserCartHandler = async (
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const cartItems = await getUserCart(parseInt(userId));
    if (!cartItems) {
      reply.status(404).send({ message: 'Cart not found' });
      return;
    }
    reply.send(cartItems);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching cart items' });
  }
};

export const deleteCartItemHandler = async (
  request: FastifyRequest<{ Params: { cartItemId: string; userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { cartItemId, userId } = request.params;
    const deletedItem = await deleteCartItem(parseInt(cartItemId), parseInt(userId));
    if (!deletedItem) {
      reply.status(404).send({ message: 'Cart item not found' });
      return;
    }
    reply.send(deletedItem);
  } catch (error) {
    reply.status(500).send({ message: 'Error deleting cart item' });
  }
};

export const addProductToCartHandler = async (
  request: FastifyRequest<{ Params: { userId: string }; Body: { productId: number; quantity: number } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = request.params;
    const { productId, quantity } = request.body;
    const cartItem = await addProductToCart(parseInt(userId), productId, quantity, {});
    if (!cartItem) {
      reply.status(404).send({ message: 'Product not found' });
      return;
    }
    reply.send(cartItem);
  } catch (error) {
    reply.status(500).send({ message: 'Error adding product to cart', error: (error as Error).message });
  }
};

export const updateCartItemQuantityHandler = async (
  request: FastifyRequest<{ Params: { cartItemId: string; userId: string }; Body: { quantity: number } }>,
  reply: FastifyReply
) => {
  try {
    const { cartItemId, userId } = request.params;
    const { quantity } = request.body;
    const updatedItem = await updateCartItemQuantity(parseInt(cartItemId), parseInt(userId), quantity);
    if (!updatedItem) {
      reply.status(404).send({ message: 'Cart item not found' });
      return;
    }
    reply.send(updatedItem);
  } catch (error) {
    reply.status(500).send({ message: 'Error updating cart item quantity' });
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