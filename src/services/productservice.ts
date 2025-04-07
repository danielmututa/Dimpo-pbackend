// import { CartItem } from './cartService';
// import { PrismaClient, Prisma } from "@prisma/client";
// import { productSchema } from "../models/products";
// import { z } from "zod";

// const prisma = new PrismaClient();

// // Get all products
// export const getAllProducts = async () => {
//   return await prisma.products.findMany({
//     include: {
//       categories: true,
//       reviews: true,
//       cart: true,
//       order_items: true,
//     },
//   });
// };

// // Get single product by ID
// export const getProductById = async (id: number) => {
//   return await prisma.products.findUnique({
//     where: { id },
//     include: {
//       categories: true,
//       reviews: true,
//       cart: true,
//       order_items: true,
//     },
//   });
// };

// // Create new product
// // export const createProduct = async (data: z.infer<typeof productSchema>) => {
// //   const validatedData = productSchema.parse(data);
  
// //   const createData: Prisma.productsCreateInput = {
// //     name: validatedData.name,
// //     description: validatedData.description ?? null,
// //     price: validatedData.price,
// //     stock_quantity: validatedData.stock_quantity,
// //     image_url: validatedData.image_url ?? null,
// //     discount_percentage: validatedData.discount_percentage ?? 0,
// //     views: validatedData.views ?? 0,
// //     created_at: validatedData.created_at ?? new Date(),
// //     updated_at: validatedData.updated_at ?? new Date(),
// //   };

// //   // Only add categories if provided
// //   if (validatedData.category_id) {
// //     createData.categories = {
// //       connect: { id: validatedData.category_id }
// //     };
// //   }

// //   return await prisma.products.create({
// //     data: createData,
// //     include: {
// //       categories: true,
// //       reviews: true,
// //       cart: true,
// //       order_items: true,
// //     },
// //   });
// // };


// export const createProduct = async (data: z.infer<typeof productSchema>) => {
//   const validatedData = productSchema.parse(data);

//   const createData: Prisma.productsCreateInput = {
//     name: validatedData.name,
//     description: validatedData.description ?? null,
//     price: validatedData.price,
//     stock_quantity: validatedData.stock_quantity,
//     image_url: validatedData.image_url ?? null,
//     discount_percentage: validatedData.discount_percentage ?? 0,
//     views: validatedData.views ?? 0,
//     created_at: validatedData.created_at ?? new Date(),
//     updated_at: validatedData.updated_at ?? new Date(),
//   };

//   // Handle category relationship if category_id is provided
//   if (validatedData.category_id) {
//     createData.categories = {
//       connect: { id: validatedData.category_id }
//     };
//   }

//   // Handle cart items if provided
//   if (validatedData.cart && validatedData.cart.length > 0) {
//     createData.cart = {
//       create: validatedData.cart.map((item) => ({
//         user_id: item.user_id,
//         quantity: item.quantity,
//         price:validatedData.price * CartItem.quantity,
//         created_at: item.created_at ?? new Date(),
//       })),
//     };
//   }

//   // Handle reviews if provided
//   if (validatedData.reviews && validatedData.reviews.length > 0) {
//     createData.reviews = {
//       create: validatedData.reviews.map((item) => ({
//         user_id: item.user_id ?? null,  // Ensure user_id is never undefined
//         rating: item.rating ?? null,     // Ensure rating is never undefined
//         comment: item.comment ?? "",     // Ensure comment is never undefined
//         created_at: item.created_at ?? new Date(),  // Ensure created_at is never undefined
//       })),
//     };
//   }

//   // Handle order items if provided
//   if (validatedData.order_items && validatedData.order_items.length > 0) {
//     createData.order_items = {
//       create: validatedData.order_items.map((item) => ({
//         order_id: item.order_id,
//         quantity: item.quantity,
//         price: validatedData.price,
//       })),
//     };
//   }

//   return await prisma.products.create({
//     data: createData,
//     include: {
//       categories: true,
//       reviews: true,
//       cart: true,
//       order_items: true,
//     },
//   });
// };



// export const addProductToCart = async (productId: number, userId: number, quantity: number = 1) => {
//   // Get product price
//   const product = await prisma.products.findUnique({
//     where: { id: productId },
//     select: { price: true, stock_quantity: true }
//   });


//   if (!product) {
//     throw new Error('Product not found');
//   }

//   if (product.stock_quantity < quantity) {
//     throw new Error('Insufficient stock');
//   }

//   // Check if item already exists in cart
//   const existingCartItem = await prisma.cart.findFirst({
//     where: {
//       product_id: productId,
//       user_id: userId
//     }
//   });

//   if (existingCartItem) {
//     // Update quantity if item exists
//     const newQuantity = existingCartItem.quantity + quantity;
//     return await prisma.cart.update({
//       where: { id: existingCartItem.id },
//       data: {
//         quantity: newQuantity,
//         price: validatedData.price* newQuantity,
//         updated_at: new Date()
//       },
//       include: {
//         products: true
//       }
//     });
//   }

//   // Create new cart item if it doesn't exist
//   return await prisma.cart.create({
//     data: {
//       user_id: userId,
//       product_id: productId,
//       quantity: quantity,
//       price: product.price * quantity,
//       created_at: new Date(),
//       updated_at: new Date()
//     },
//     include: {
//       products: true
//     }
//   });
// };

// // Update cart item quantity
// export const updateCartItemQuantity = async (cartItemId: number, userId: number, newQuantity: number) => {
//   if (newQuantity <= 0) {
//     // If quantity is 0 or negative, remove the item
//     return await deleteCartItem(cartItemId, userId);
//   }

//   // Get cart item with product price
//   const cartItem = await prisma.cart.findFirst({
//     where: {
//       id: cartItemId,
//       user_id: userId
//     },
//     include: {
//       products: {
//         select: {
//           price: true,
//           stock_quantity: true
//         }
//       }
//     }
//   });

//   if (!cartItem) {
//     throw new Error('Cart item not found');
//   }

//   if (cartItem.products.stock_quantity < newQuantity) {
//     throw new Error('Insufficient stock');
//   }

//   return await prisma.cart.update({
//     where: { id: cartItemId },
//     data: {
//       quantity: newQuantity,
//       price: cartItem.products.price * newQuantity,
//       updated_at: new Date()
//     },
//     include: {
//       products: true
//     }
//   });
// };

// // Remove item from cart
// export const deleteCartItem = async (cartItemId: number, userId: number) => {
//   // Verify the cart item belongs to the user
//   const cartItem = await prisma.cart.findFirst({
//     where: {
//       id: cartItemId,
//       user_id: userId
//     }
//   });

//   if (!cartItem) {
//     throw new Error('Cart item not found or does not belong to user');
//   }

//   return await prisma.cart.delete({
//     where: { id: cartItemId }
//   });
// };




// // Get user's cart with calculated totals
// export const getUserCart = async (userId: number) => {
//   const cartItems = await prisma.cart.findMany({
//     where: { user_id: userId },
//     include: {
//       products: {
//         include: {
//           categories: true
//         }
//       }
//     }
//   });

//   // Calculate totals
//   const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
//   const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   return {
//     items: cartItems,
//     subtotal,
//     totalItems
//   };
// };

// // Clear user's cart
// export const clearUserCart = async (userId: number) => {
//   return await prisma.cart.deleteMany({
//     where: { user_id: userId }
//   });
// };

// // Create new product



// // Update product
// export const updateProduct = async (id: number, data: Partial<z.infer<typeof productSchema>>) => {
//   const validatedData = productSchema.partial().parse(data);
  
//   const updateData: Prisma.productsUpdateInput = {
//     updated_at: new Date(),
//   };

//   // Add fields only if they are provided
//   if (validatedData.name !== undefined) updateData.name = validatedData.name;
//   if (validatedData.description !== undefined) updateData.description = validatedData.description;
//   if (validatedData.price !== undefined) updateData.price = validatedData.price;
//   if (validatedData.stock_quantity !== undefined) updateData.stock_quantity = validatedData.stock_quantity;
//   if (validatedData.image_url !== undefined) updateData.image_url = validatedData.image_url;
//   if (validatedData.discount_percentage !== undefined) updateData.discount_percentage = validatedData.discount_percentage;
//   if (validatedData.views !== undefined) updateData.views = validatedData.views;
  
//   // Handle category relationship
//   if (validatedData.category_id !== undefined) {
//     updateData.categories = validatedData.category_id 
//       ? { connect: { id: validatedData.category_id } }
//       : { disconnect: true };
//   }

//   return await prisma.products.update({
//     where: { id },
//     data: updateData,
//   });
// };

// // Delete product
// export const deleteProduct = async (id: number) => {
//   return await prisma.products.delete({
//     where: { id },
//   });
// };



import { PrismaClient, Prisma } from "@prisma/client";
import { productSchema } from "../models/products";
import { z } from "zod";

const prisma = new PrismaClient();

// Get all products
export const getAllProducts = async () => {
  return await prisma.products.findMany({
    include: {
      categories: true,
      reviews: true,
      cart: true,
      order_items: true,
    },
  });
};

// Get single product by ID
export const getProductById = async (id: number) => {
  return await prisma.products.findUnique({
    where: { id },
    include: {
      categories: true,
      reviews: true,
      cart: true,
      order_items: true,
    },
  });
};

// Create new product
export const createProduct = async (data: z.infer<typeof productSchema>) => {
  const validatedData = productSchema.parse(data);

  const createData: Prisma.productsCreateInput = {
    name: validatedData.name,
    description: validatedData.description ?? null,
    price: validatedData.price,
    image_url: validatedData.image_url ?? null,
    stock_quantity: validatedData.stock_quantity ?? 0,
    discount_percentage: validatedData.discount_percentage ?? 0,
    views: validatedData.views ?? 0,
    created_at: validatedData.created_at ?? new Date(),
    updated_at: validatedData.updated_at ?? new Date(),
  };

  if (validatedData.category_id) {
    createData.categories = {
      connect: { id: validatedData.category_id }
    };
  }

  if (validatedData.cart && validatedData.cart.length > 0) {
    createData.cart = {
      create: validatedData.cart.map((item) => ({
        user_id: item.user_id,
        quantity: item.quantity,
        price: validatedData.price * item.quantity,
        created_at: item.created_at ?? new Date(),
      })),
    };
  }

  if (validatedData.reviews && validatedData.reviews.length > 0) {
    createData.reviews = {
      create: validatedData.reviews.map((item) => ({
        user_id: item.user_id ?? null,
        rating: item.rating ?? null,
        comment: item.comment ?? "",
        created_at: item.created_at ?? new Date(),
      })),
    };
  }

  if (validatedData.order_items && validatedData.order_items.length > 0) {
    createData.order_items = {
      create: validatedData.order_items.map((item) => ({
        order_id: item.order_id,
        quantity: item.quantity,
        price: validatedData.price,
      })),
    };
  }

  return await prisma.products.create({
    data: createData,
    include: {
      categories: true,
      reviews: true,
      cart: true,
      order_items: true,
    },
  });
};





// export const
  // const product = await prisma.products.findUnique({
  //   where: { id: productId },
  //   select: { price: true, stock_quantity: true }
  // });
  
  
  export const addProductToCart = async (
    userId: number,
    productId: number,
    quantity: number,
    data: Partial<z.infer<typeof productSchema>>
  ) => {
    const validatedData = productSchema.partial().parse(data);
    
    if (!validatedData) throw new Error('Product not found');
    
    // Handle undefined/null stock quantity
    const stockQuantity = validatedData.stock_quantity ?? 0;
    if (stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }
  
    // Update product's stock quantity
    await prisma.products.update({
      where: { id: productId },
      data: {
        stock_quantity: {
          decrement: quantity
        },
        updated_at: new Date()
      }
    });
  
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        product_id: productId,
        user_id: userId
      }
    });
  
    // Handle Decimal type for price calculations
    const productPrice = new Prisma.Decimal(validatedData.price ?? 0);
  
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      return await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          price: productPrice.mul(newQuantity),
          updated_at: new Date()
        },
        include: {
          products: true
        }
      });
    }
  
    return await prisma.cart.create({
      data: {
        user_id: userId,
        product_id: productId,
        quantity,
        price: productPrice.mul(quantity),
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        products: true
      }
    });
  };




  export const updateCartItemQuantity = async (
    cartItemId: number,
    userId: number,
    newQuantity: number,
    data?: Partial<z.infer<typeof productSchema>> // Optional product data
  ) => {
    if (newQuantity <= 0) {
      return await deleteCartItem(cartItemId, userId);
    }
  
    const cartItem = await prisma.cart.findFirst({
      where: {
        id: cartItemId,
        user_id: userId
      },
      include: {
        products: {
          select: {
            id: true, // Added id field
            price: true,
            stock_quantity: true
          }
        }
      }
    });
  
    if (!cartItem || !cartItem.products) {
      throw new Error('Cart item not found');
    }
  
    // Validate stock if product data is provided
    if (data) {
      const validatedData = productSchema.partial().parse(data);
      const stockQuantity = validatedData.stock_quantity ?? 0;
      if (stockQuantity < newQuantity) {
        throw new Error('Insufficient stock');
      }
    }
  
    // Handle Decimal type for price calculations
    const productPrice = new Prisma.Decimal(cartItem.products.price);
  
    return await prisma.cart.update({
      where: { id: cartItemId },
      data: {
        quantity: newQuantity,
        price: productPrice.mul(newQuantity),
        updated_at: new Date()
      },
      include: {
        products: true
      }
    });
  };



// Remove item from cart
export const deleteCartItem = async (
  cartItemId: number, 
  userId: number,
  data?: Partial<z.infer<typeof productSchema>> // Optional product data
) => {
  const cartItem = await prisma.cart.findFirst({
    where: {
      id: cartItemId,
      user_id: userId
    },
    include: {
      products: {
        select: {
          id: true,
          stock_quantity: true
        }
      }
    }
  });

  if (!cartItem) {
    throw new Error('Cart item not found or does not belong to user');
  }

  // Restore product stock if product data is provided
  if (data && cartItem.products) {
    await prisma.products.update({
      where: { id: cartItem.products.id },
      data: {
        stock_quantity: {
          increment: cartItem.quantity
        },
        updated_at: new Date()
      }
    });
  }

  return await prisma.cart.delete({
    where: { id: cartItemId }
  });
};

// Get user's cart
export const getUserCart = async (userId: number) => {
  const cartItems = await prisma.cart.findMany({
    where: { user_id: userId },
    include: {
      products: {
        include: {
          categories: true
        }
      }
    }
  });

  // Convert all prices to Decimal for safe calculations
  const subtotal = cartItems.reduce((sum, item) => {
    return sum.add(new Prisma.Decimal(item.price || 0));
  }, new Prisma.Decimal(0));

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Calculate discounts using Decimal
  const totalDiscount = cartItems.reduce((sum, item) => {
    const discount = item.products?.discount_percentage || 0;
    const itemPrice = new Prisma.Decimal(item.price || 0);
    return sum.add(itemPrice.mul(discount).div(100));
  }, new Prisma.Decimal(0));

  return {
    items: cartItems,
    subtotal: subtotal.toNumber(),
    totalItems,
    totalDiscount: totalDiscount.toNumber(),
    grandTotal: subtotal.minus(totalDiscount).toNumber()
  };
};
// Clear user's cart
export const clearUserCart = async (userId: number) => {
  return await prisma.cart.deleteMany({
    where: { user_id: userId }
  });
};

// Update product
export const updateProduct = async (id: number, data: Partial<z.infer<typeof productSchema>>) => {
  const validatedData = productSchema.partial().parse(data);
  
  const updateData: Prisma.productsUpdateInput = {
    updated_at: new Date(),
  };

  if (validatedData.name !== undefined) updateData.name = validatedData.name;
  if (validatedData.description !== undefined) updateData.description = validatedData.description;
  if (validatedData.price !== undefined) updateData.price = validatedData.price;
  if (validatedData.stock_quantity !== undefined) updateData.stock_quantity = validatedData.stock_quantity;
  if (validatedData.image_url !== undefined) updateData.image_url = validatedData.image_url;
  if (validatedData.discount_percentage !== undefined) updateData.discount_percentage = validatedData.discount_percentage;
  if (validatedData.views !== undefined) updateData.views = validatedData.views;

  if (validatedData.category_id !== undefined) {
    updateData.categories = validatedData.category_id 
      ? { connect: { id: validatedData.category_id } }
      : { disconnect: true };
  }

  return await prisma.products.update({
    where: { id },
    data: updateData,
  });
};

// Delete product
export const deleteProduct = async (id: number) => {
  return await prisma.products.delete({
    where: { id },
  });
};


