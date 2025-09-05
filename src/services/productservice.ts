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






// // ------------------- REVIEWS -------------------
// export const addReview = async (
//   productId: number,
//   data: { user_id?: number; rating: number; comment: string }
// ) => {
//   return await prisma.reviews.create({
//     data: {
//       product_id: productId,
//       user_id: data.user_id ?? null,
//       rating: data.rating,
//       comment: data.comment,
//       created_at: new Date(),
//     },
//   });
// };


// export const getProductReviews = async (productId: number) => {
//   return await prisma.reviews.findMany({
//     where: { product_id: productId },
//     include: {
//       users: {  // Changed from 'user' to 'users'
//         select: {
//           id: true,
//           username: true,
//           email: true
//         }
//       }
//     },
//     orderBy: { created_at: "desc" },
//   });
// };


// ===============================================
// REVIEW SERVICES - FIXED
// ===============================================









export class ReviewService {
  static async addReview(
    productId: number,
    data: { user_id?: number; rating: number; comment: string }
  ) {
    return await prisma.reviews.create({
      data: {
        product_id: productId,
        user_id: data.user_id ?? null,
        rating: data.rating,
        comment: data.comment,
        created_at: new Date(),
      },
    });
  }

  static async getProductReviews(productId: number) {
    const reviews = await prisma.reviews.findMany({
      where: { product_id: productId },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        review_likes: {
          include: {
            users: {
              select: { id: true, username: true }
            }
          }
        },
        review_comments: {
          include: {
            users: {
              select: { id: true, username: true }
            }
          },
          orderBy: { created_at: "desc" }
        }
      },
      orderBy: { created_at: "desc" },
    });

    // Add like/dislike counts to each review
    return reviews.map(review => ({
      ...review,
      likes_count: review.review_likes.filter(like => like.is_like === true).length,
      dislikes_count: review.review_likes.filter(like => like.is_like === false).length,
      comments_count: review.review_comments.length
    }));
  }

  static async deleteReview(reviewId: number, userId?: number) {
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId }
    });
    
    if (!review || (userId && review.user_id !== userId)) {
      throw new Error("Not authorized to delete this review");
    }
    
    return await prisma.reviews.delete({
      where: { id: reviewId }
    });
  }
}

export class ReviewLikeService {
  static async toggleReviewLike(
    reviewId: number,
    userId: number,
    isLike: boolean
  ) {
    const existing = await prisma.review_likes.findUnique({
      where: {
        review_id_user_id: {
          review_id: reviewId,
          user_id: userId
        }
      }
    });

    if (existing) {
      if (existing.is_like === isLike) {
        return await prisma.review_likes.delete({
          where: { id: existing.id }
        });
      } else {
        return await prisma.review_likes.update({
          where: { id: existing.id },
          data: { is_like: isLike }
        });
      }
    } else {
      return await prisma.review_likes.create({
        data: {
          review_id: reviewId,
          user_id: userId,
          is_like: isLike
        }
      });
    }
  }

  static async getReviewLikeStatus(reviewId: number, userId: number) {
    const like = await prisma.review_likes.findUnique({
      where: {
        review_id_user_id: {
          review_id: reviewId,
          user_id: userId
        }
      }
    });
    
    return like ? like.is_like : null;
  }
}

export class ReviewCommentService {
  static async addReviewComment(
    reviewId: number,
    data: { user_id?: number; comment: string }
  ) {
    return await prisma.review_comments.create({
      data: {
        review_id: reviewId,
        user_id: data.user_id ?? null,
        comment: data.comment,
        created_at: new Date(),
      },
      include: {
        users: {
          select: { id: true, username: true }
        }
      }
    });
  }

  static async getReviewComments(reviewId: number) {
    return await prisma.review_comments.findMany({
      where: { review_id: reviewId },
      include: {
        users: {
          select: { id: true, username: true }
        }
      },
      orderBy: { created_at: "desc" }
    });
  }

  static async deleteReviewComment(commentId: number, userId?: number) {
    const comment = await prisma.review_comments.findUnique({
      where: { id: commentId }
    });
    
    if (!comment || (userId && comment.user_id !== userId)) {
      throw new Error("Not authorized to delete this comment");
    }
    
    return await prisma.review_comments.delete({
      where: { id: commentId }
    });
  }
}

export class ProductViewService {
  static async trackProductView(
    productId: number,
    data: { 
      user_id?: number; 
      ip_address?: string; 
      user_agent?: string 
    }
  ) {
    try {
      // Build the OR conditions array properly
      const orConditions: any[] = [];
      
      if (data.user_id !== undefined) {
        orConditions.push({ user_id: data.user_id });
      }
      
      if (data.ip_address !== undefined) {
        orConditions.push({ ip_address: data.ip_address });
      }

      const existingView = await prisma.product_views.findFirst({
        where: {
          product_id: productId,
          ...(orConditions.length > 0 && { OR: orConditions }),
          viewed_at: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      });

      if (!existingView) {
        return await prisma.product_views.create({
          data: {
            product_id: productId,
            user_id: data.user_id ?? null,
            ip_address: data.ip_address ?? null,
            user_agent: data.user_agent ?? null,
            viewed_at: new Date(),
          },
        });
      }
      
      return null;
    } catch (error) {
      console.log('View already tracked:', error);
      return null;
    }
  }

  static async getProductViewCount(productId: number) {
    const totalViews = await prisma.product_views.count({
      where: { product_id: productId }
    });

    // Fixed: Remove distinct for count operation
    const uniqueUsers = await prisma.product_views.groupBy({
      by: ['user_id'],
      where: { 
        product_id: productId,
        user_id: { not: null }
      }
    });

    const todayViews = await prisma.product_views.count({
      where: {
        product_id: productId,
        viewed_at: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    const weekViews = await prisma.product_views.count({
      where: {
        product_id: productId,
        viewed_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    return {
      total_views: totalViews,
      unique_users: uniqueUsers.length, // Count the grouped results
      today_views: todayViews,
      week_views: weekViews
    };
  }

  static async getProductWithViews(productId: number) {
    return await prisma.products.findUnique({
      where: { id: productId },
      include: {
        product_views: {
          select: {
            id: true,
            viewed_at: true,
            users: {
              select: {
                id: true,
                username: true
              }
            }
          },
          orderBy: { viewed_at: 'desc' },
          take: 10
        },
        _count: {
          select: {
            product_views: true,
            reviews: true
          }
        }
      }
    });
  }

  static async getMostViewedProducts(limit: number = 10) {
    return await prisma.products.findMany({
      include: {
        _count: {
          select: {
            product_views: true,
            reviews: true
          }
        }
      },
      orderBy: {
        product_views: {
          _count: 'desc'
        }
      },
      take: limit
    });
  }
}