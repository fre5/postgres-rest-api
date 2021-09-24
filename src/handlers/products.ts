import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/products';
import jwt from 'jsonwebtoken';

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
};

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product = await store.show(id);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price
  };
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const newProduct = await store.create(product.name, product.price);
    res.json(newProduct);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

export default productRoutes;
