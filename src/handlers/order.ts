import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import jwt from 'jsonwebtoken';

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.post('/orders/:id/products', addProduct);
};

const store = new OrderStore();

const index = async (req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const order: Order = {
    userId: req.body.userId,
    status: 'open'
  };
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const orderId: string = req.params.id;
  const productId: string = req.body.productId;
  const quantity: number = parseInt(req.body.quantity);
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

export default orderRoutes;
