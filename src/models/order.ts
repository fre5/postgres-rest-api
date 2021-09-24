// @ts-ignore
import Client from '../database';

export type Order = {
  id?: string;
  status: string;
  userId: string;
}

export class OrderStore {
  async index (): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not retrieve orders: ${err}`);
    }
  }

  async show (id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not find order id: ${id}. Error: ${err}`);
    }
  }

  async addProduct (quantity: number, orderId: string, productId: string): Promise<Order> {
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(ordersql, [orderId]);
      const order = result.rows[0];
      if (order.status !== 'open') {
        throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`);
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
    }
  }

  async create (o: Order): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2)';
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [o.userId, o.status]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not create order id: ${o.userId}. Error: ${err}`);
    }
  }
}
