import { PrismaClient, Prisma } from "@prisma/client";
import { productSchema } from "../models/products";
import { z } from "zod";

const prisma = new PrismaClient();

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



export const createProduct = async (
  data: z.infer<typeof productSchema>,
  file?: { filename: string }
) => {
  const validatedData = productSchema.parse(data);

  const createData: Prisma.productsCreateInput = {
    name: validatedData.name,
    description: validatedData.description ?? null,
    price: validatedData.price,
    image_url: file ? `/Uploads/${file.filename}` : null,
    stock_quantity: validatedData.stock_quantity ?? 0,
    discount_percentage: validatedData.discount_percentage ?? 0,
    views: validatedData.views ?? 0,
    created_at: validatedData.created_at ?? new Date(),
    updated_at: validatedData.updated_at ?? new Date(),
  };

  if (validatedData.category_name) {
    createData.categories = {
      connectOrCreate: {
        where: { name: validatedData.category_name },
        create: { name: validatedData.category_name },
      },
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







// jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
// export const addProductToCart = async (userId: number, productId: number, quantity: number) => {
//   const product = await prisma.products.findUnique({
//     where: { id: productId }
//   });

//   if (!product) {
//     throw new Error('Product not found');
//   }

//   const existingCartItem = await prisma.cart.findFirst({
//     where: {
//        product_id: productId,
//        user_id: userId 
//     }
//   });

//   const productPrice = new Prisma.Decimal(product.price);
//   const originalStock = product.stock_quantity ?? 0;

//   if (existingCartItem) {
//     // Update existing cart item - don't check stock, just update quantity
//     const newTotalQuantity = existingCartItem.quantity + quantity;
    
//     return await prisma.cart.update({
//       where: { id: existingCartItem.id },
//       data: {
//         quantity: newTotalQuantity,
//         price: productPrice.mul(newTotalQuantity),
//         updated_at: new Date()
//       },
//       include: { products: true }
//     });
//   } else {
//     // Create new cart item - don't check stock for now
//     return await prisma.cart.create({
//       data: {
//         user_id: userId,
//         product_id: productId,
//         quantity,
//         price: productPrice.mul(quantity),
//         created_at: new Date(),
//         updated_at: new Date()
//       },
//       include: { products: true }
//     });
//   }
// };
// jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj




export const addProductToCart = async (userId: number, productId: number, quantity: number) => {
  const product = await prisma.products.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const originalStock = product.stock_quantity ?? 0;

  // Check if there's enough stock
  if (originalStock < quantity) {
    throw new Error(`Insufficient stock. Only ${originalStock} items available.`);
  }

  const existingCartItem = await prisma.cart.findFirst({
    where: {
       product_id: productId,
       user_id: userId 
    }
  });

  const productPrice = new Prisma.Decimal(product.price);

  if (existingCartItem) {
    // Check if adding this quantity would exceed available stock
    const totalRequestedQuantity = existingCartItem.quantity + quantity;
    if (originalStock < totalRequestedQuantity) {
      throw new Error(`Insufficient stock. Only ${originalStock} items available, you already have ${existingCartItem.quantity} in cart.`);
    }

    // Update existing cart item AND decrease stock
    const [updatedCartItem] = await prisma.$transaction([
      prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
          price: productPrice.mul(existingCartItem.quantity + quantity),
          updated_at: new Date()
        },
        include: { products: true }
      }),
      prisma.products.update({
        where: { id: productId },
        data: {
          stock_quantity: { decrement: quantity },
          updated_at: new Date()
        }
      })
    ]);

    return updatedCartItem;
  } else {
    // Create new cart item AND decrease stock
    const [newCartItem] = await prisma.$transaction([
      prisma.cart.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity,
          price: productPrice.mul(quantity),
          created_at: new Date(),
          updated_at: new Date()
        },
        include: { products: true }
      }),
      prisma.products.update({
        where: { id: productId },
        data: {
          stock_quantity: { decrement: quantity },
          updated_at: new Date()
        }
      })
    ]);

    return newCartItem;
  }
};


// export const updateCartItemQuantity = async (
//   cartItemId: number,
//   userId: number,
//   newQuantity: number
// ) => {
//   // Delete the item if quantity is zero or less
//   if (newQuantity <= 0) {
//     return await deleteCartItem(cartItemId, userId);
//   }

  

//   // Get cart item with product info
//   const cartItem = await prisma.cart.findFirst({
//     where: {
//       id: cartItemId,
//       user_id: userId
//     },
//     include: {
//       products: {
//         select: {
//           id: true,
//           price: true,
//           stock_quantity: true
//         }
//       }
//     }
//   });

//   if (!cartItem || !cartItem.products) {
//     throw new Error('Cart item not found');
//   }

//   const product = cartItem.products;

//   // Check stock
//   if ((product.stock_quantity ?? 0) < newQuantity) {
//     throw new Error('Insufficient stock');
//   }

//   // Update stock: restore old quantity, then decrement new quantity
//   const stockAdjustment = newQuantity - cartItem.quantity;

//   await prisma.products.update({
//     where: { id: product.id },
//     data: {
//       stock_quantity: { decrement: stockAdjustment },
//       updated_at: new Date()
//     }
//   });

//   // Update cart item
//   const productPrice = new Prisma.Decimal(product.price);

//   return await prisma.cart.update({
//     where: { id: cartItemId },
//     data: {
//       quantity: newQuantity,
//       price: productPrice.mul(newQuantity),
//       updated_at: new Date()
//     },
//     include: { products: true }
//   });
// };

export const updateCartItemQuantity = async (
  cartItemId: number,
  userId: number,
  newQuantity: number
) => {
  // Delete the item if quantity is zero or less
  if (newQuantity <= 0) {
    return await deleteCartItem(cartItemId, userId, true); // Restore stock when deleting
  }

  // Get cart item with product info
  const cartItem = await prisma.cart.findFirst({
    where: {
      id: cartItemId,
      user_id: userId
    },
    include: {
      products: {
        select: {
          id: true,
          price: true,
          stock_quantity: true
        }
      }
    }
  });

  if (!cartItem || !cartItem.products) {
    throw new Error('Cart item not found');
  }

  const product = cartItem.products;
  const currentQuantity = cartItem.quantity;
  const quantityDifference = newQuantity - currentQuantity;

  // If increasing quantity, check stock availability
  if (quantityDifference > 0) {
    if ((product.stock_quantity ?? 0) < quantityDifference) {
      throw new Error(`Insufficient stock. Only ${product.stock_quantity} items available.`);
    }
  }

  // Update cart item and adjust stock using transaction
  const productPrice = new Prisma.Decimal(product.price);

  const [updatedCartItem] = await prisma.$transaction([
    prisma.cart.update({
      where: { id: cartItemId },
      data: {
        quantity: newQuantity,
        price: productPrice.mul(newQuantity),
        updated_at: new Date()
      },
      include: { products: true }
    }),
    prisma.products.update({
      where: { id: product.id },
      data: {
        stock_quantity: { decrement: quantityDifference }, // This will add back if negative ...
        updated_at: new Date()
      }
    })
  ]);


  return updatedCartItem;
};


// Remove item from cart
// export const deleteCartItem = async (
//   cartItemId: number, 
//   userId: number,
//   data?: Partial<z.infer<typeof productSchema>> 
// ) => {
//   const cartItem = await prisma.cart.findFirst({
//     where: {
//       id: cartItemId,
//       user_id: userId
//     },
//     include: {
//       products: {
//         select: {
//           id: true,
//           stock_quantity: true
//         }
//       }
//     }
//   });

//   if (!cartItem) {
//     throw new Error('Cart item not found or does not belong to user');
//   }

//   // Restore product stock if product data is provided
//   if (data && cartItem.products) {
//     await prisma.products.update({
//       where: { id: cartItem.products.id },
//       data: {
//         stock_quantity: {
//           increment: cartItem.quantity
//         },
//         updated_at: new Date()
//       }
//     });
//   }

//   return await prisma.cart.delete({
//     where: { id: cartItemId }
//   });
// };


export const deleteCartItem = async (
  cartItemId: number, 
  userId: number,
  restoreStock: boolean = true // Add parameter to control stock restoration
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

  // Use transaction to delete cart item and restore stock
  if (restoreStock && cartItem.products) {
    await prisma.$transaction([
      prisma.cart.delete({
        where: { id: cartItemId }
      }),
      prisma.products.update({
        where: { id: cartItem.products.id },
        data: {
          stock_quantity: {
            increment: cartItem.quantity
          },
          updated_at: new Date()
        }
      })
    ]);
  } else {
    await prisma.cart.delete({
      where: { id: cartItemId }
    });
  }

  return cartItem;
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

  if (validatedData.category_name !== undefined) {
    updateData.categories = validatedData.category_name
      ? {
          connectOrCreate: {
            where: { name: validatedData.category_name },
            create: { name: validatedData.category_name },
          },
        }
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


export const getAllProductImages = async () => {
  const products = await prisma.products.findMany({
    where: {
      image_url: {
        not: null, // Only include products with an image_url
      },
    },
    select: {
      image_url: true, // Only fetch the image_url field
    },
  });
  return products.map((product) => product.image_url); // Return an array of image URLs
};














