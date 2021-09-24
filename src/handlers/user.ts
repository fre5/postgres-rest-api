import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password
  };

  try {
    const newUser = await store.create(user);
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  const user = req.body.username;
  const password = req.body.password;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const validUser = await store.authenticate(user, password);
    res.json(validUser);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  const user = {
    id: parseInt(req.params.id),
    username: req.body.username,
    password: req.body.password
  };
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    const decoded: { user: { passwordDigest: string, id: number }, iat: number } =
      jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    if (decoded.user.id !== user.id) {
      throw new Error('User id does not match!');
    } else {
      const updated = await store.update(user.username, user.password);
      res.json(updated);
    }
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const remove = async (req: Request, res: Response) => {
  const username = req.body.username;
  try {
    const authHeader: string = req.headers.authorization as string;
    const token: string = authHeader.split(' ')[1] as string;
    jwt.verify(token, process.env.TOKEN_SECRET as string) as { user: { passwordDigest: string, id: number }, iat: number };
    const updated = await store.remove(username);
    res.json(updated);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users/authenticate', authenticate);
  app.post('/users', create);
  app.put('/users/:id', update);
  app.delete('/users/', remove);
};

export default userRoutes;
