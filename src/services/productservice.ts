// import { PrismaClient } from "@prisma/client";
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


// export const createProduct = async (data: z.infer<typeof productSchema>) => {
//   const validatedData = productSchema.parse(data);

//   return await prisma.products.create({ 
//     data: {
//       name: validatedData.name,
//       description: validatedData.description,
//       price: validatedData.price,
//       stock_quantity: validatedData.stock_quantity,
//       category_id: validatedData.category_id,
//       image_url: validatedData.image_url,
//       discount_percentage: validatedData.discount_percentage,
//       views: validatedData.views,
//       created_at: validatedData.created_at,
//       updated_at: validatedData.updated_at,

//     },
//   });
// };

// // Update product
// export const updateProduct = async (id: number, data: Partial<z.infer<typeof productSchema>>) => {
//   const validatedData = productSchema.partial().parse(data);

//   return await prisma.products.update({
//     where: { id },
//     data: validatedData,
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
    stock_quantity: validatedData.stock_quantity,
    image_url: validatedData.image_url ?? null,
    discount_percentage: validatedData.discount_percentage ?? 0,
    views: validatedData.views ?? 0,
    created_at: validatedData.created_at ?? new Date(),
    updated_at: validatedData.updated_at ?? new Date(),
  };

  // Only add categories if provided
  if (validatedData.category_id) {
    createData.categories = {
      connect: { id: validatedData.category_id }
    };
  }

  return await prisma.products.create({
    data: createData,
  });
};

// Update product
export const updateProduct = async (id: number, data: Partial<z.infer<typeof productSchema>>) => {
  const validatedData = productSchema.partial().parse(data);
  
  const updateData: Prisma.productsUpdateInput = {
    updated_at: new Date(),
  };

  // Add fields only if they are provided
  if (validatedData.name !== undefined) updateData.name = validatedData.name;
  if (validatedData.description !== undefined) updateData.description = validatedData.description;
  if (validatedData.price !== undefined) updateData.price = validatedData.price;
  if (validatedData.stock_quantity !== undefined) updateData.stock_quantity = validatedData.stock_quantity;
  if (validatedData.image_url !== undefined) updateData.image_url = validatedData.image_url;
  if (validatedData.discount_percentage !== undefined) updateData.discount_percentage = validatedData.discount_percentage;
  if (validatedData.views !== undefined) updateData.views = validatedData.views;
  
  // Handle category relationship
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