import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import jwt from 'jsonwebtoken';

const dashboard = new DashboardQueries();

const dashboardRoutes = (app: express.Application) => {
  app.get('/products-in-orders', productsInOrders);
  app.get('/users-with-orders', usersWithOrders);
  app.get('/five-most-expensive', fiveMostExpensive);
  app.get('/current-order/:id', currentOrder);
};

const productsInOrders = async (req: Request, res: Response) => {
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const products = await dashboard.productsInOrders();
    res.json(products);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const usersWithOrders = async (req: Request, res: Response) => {
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const users = await dashboard.usersWithOrders();
    res.json(users);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const fiveMostExpensive = async (req: Request, res: Response) => {
  try {
    const products = await dashboard.fiveMostExpensive();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const currentOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const cart = await dashboard.currentOrder(id);
    res.json(cart);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

export default dashboardRoutes;
