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











// export const addProductToCart = async (
//   userId: number,
//   productId: number,
//   quantity: number
// ) => {
//   console.log(`Adding to cart - UserId: ${userId}, ProductId: ${productId}, Quantity: ${quantity}`);
  
//   const product = await prisma.products.findUnique({
//     where: { id: productId }
//   });

//   if (!product) {
//     throw new Error('Product not found');
//   }

//   console.log(`Product found - Stock: ${product.stock_quantity}, Price: ${product.price}`);

//   // Check if item already in cart for this user
//   const existingCartItem = await prisma.cart.findFirst({
//     where: { 
//       product_id: productId, 
//       user_id: userId 
//     }
//   });

//   console.log('Existing cart item:', existingCartItem);

//   const productPrice = new Prisma.Decimal(product.price);
//   const currentStock = product.stock_quantity ?? 0;

//   if (existingCartItem) {
//     // Item already exists in cart
//     const newTotalQuantity = existingCartItem.quantity + quantity;
    
//     console.log(`Existing item - Current cart qty: ${existingCartItem.quantity}, Adding: ${quantity}, New total: ${newTotalQuantity}, Available stock: ${currentStock}`);
    
//     // Check if we have enough stock for the new total quantity
//     if (currentStock < newTotalQuantity) {
//       console.log(`Insufficient stock - Requesting total ${newTotalQuantity}, but only ${currentStock} available`);
//       throw new Error(`Insufficient stock. Only ${currentStock} items available, you already have ${existingCartItem.quantity} in cart.`);
//     }

//     // Update cart item (don't touch product stock yet)
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
//     // New item in cart
//     console.log(`New item - Requesting qty: ${quantity}, Available stock: ${currentStock}`);
    
//     if (currentStock < quantity) {
//       console.log(`Insufficient stock - Trying to add ${quantity}, but only ${currentStock} available`);
//       throw new Error(`Insufficient stock. Only ${currentStock} items available.`);
//     }

//     // Create new cart item (don't touch product stock yet)
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

// Add product to cart (global, no userId)
export const addProductToCart = async (
  productId: number,
  quantity: number = 1
) => {
  console.log(`Adding to cart - ProductId: ${productId}, Quantity: ${quantity}`);

  const product = await prisma.products.findUnique({
    where: { id: productId }
  });

  if (!product) throw new Error("Product not found");

  const currentStock = product.stock_quantity ?? 0;
  const productPrice = new Prisma.Decimal(product.price);

  if (currentStock < quantity) {
    throw new Error(`Insufficient stock. Only ${currentStock} items available.`);
  }

  // Decrease stock immediately
  await prisma.products.update({
    where: { id: productId },
    data: { stock_quantity: currentStock - quantity }
  });

  // Add/update cart
  const existingCartItem = await prisma.cart.findFirst({
    where: { product_id: productId }
  });

  if (existingCartItem) {
    const newTotalQuantity = existingCartItem.quantity + quantity;

    return await prisma.cart.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: newTotalQuantity,
        price: productPrice.mul(newTotalQuantity),
        updated_at: new Date()
      },
      include: { products: true }
    });
  } else {
    return await prisma.cart.create({
      data: {
        product_id: productId,
        quantity,
        price: productPrice.mul(quantity),
        created_at: new Date(),
        updated_at: new Date()
      },
      include: { products: true }
    });
  }
};



// Update cart item quantity (global)
export const updateCartItemQuantity = async (
  cartItemId: number,
  newQuantity: number
) => {
  if (newQuantity <= 0) {
    return await deleteCartItem(cartItemId);
  }

  const cartItem = await prisma.cart.findUnique({
    where: { id: cartItemId },
    include: { products: true }
  });

  if (!cartItem || !cartItem.products) {
    throw new Error("Cart item not found");
  }

  const product = cartItem.products;
  if ((product.stock_quantity ?? 0) < newQuantity) {
    throw new Error(`Insufficient stock. Only ${product.stock_quantity} items available.`);
  }

  const productPrice = new Prisma.Decimal(product.price);

  return await prisma.cart.update({
    where: { id: cartItemId },
    data: {
      quantity: newQuantity,
      price: productPrice.mul(newQuantity),
      updated_at: new Date()
    },
    include: { products: true }
  });
};



// Delete cart item (global)
export const deleteCartItem = async (cartItemId: number) => {
  const cartItem = await prisma.cart.findUnique({ where: { id: cartItemId } });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return await prisma.cart.delete({ where: { id: cartItemId } });
};


// Get user's cart
// Get cart (global)
export const getCart = async () => {
  const cartItems = await prisma.cart.findMany({
    include: {
      products: { include: { categories: true } }
    }
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum.add(new Prisma.Decimal(item.price || 0)),
    new Prisma.Decimal(0)
  );

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const totalDiscount = cartItems.reduce((sum, item) => {
    const discount = item.products?.discount_percentage || 0;
    return sum.add(new Prisma.Decimal(item.price || 0).mul(discount).div(100));
  }, new Prisma.Decimal(0));

  return {
    items: cartItems,
    subtotal: subtotal.toNumber(),
    totalItems,
    totalDiscount: totalDiscount.toNumber(),
    grandTotal: subtotal.minus(totalDiscount).toNumber()
  };
};

// Clear cart (global)
export const clearCart = async () => {
  return await prisma.cart.deleteMany();
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






