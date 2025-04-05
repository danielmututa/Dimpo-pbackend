import { FastifyRequest, FastifyReply } from 'fastify';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../services/productservice';
import { productSchema } from '../../models/products';
import { z } from 'zod';

type ProductParams = {
  id: string;
};

type ProductBody = z.infer<typeof productSchema>;

export const getProductsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const products = await getAllProducts();
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: 'Error fetching products' });
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

export const createProductHandler = async (
  request: FastifyRequest<{ Body: ProductBody }>,
  reply: FastifyReply
) => {
  try {
    const product = await createProduct(request.body);
    reply.status(201).send(product);
  } catch (error) {
    reply.status(400).send({ message: 'Invalid product data', error });
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