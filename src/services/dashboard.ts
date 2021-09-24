// @ts-ignore
import Client from '../database';

export class DashboardQueries {
  // Get all the included products in the orders
  async productsInOrders (): Promise<{ name: string, price: number, orderId: string }[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.id';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to retrieve products and orders: ${err}`);
    }
  }

  async usersWithOrders (): Promise<{ firstName: string, lastName: string }> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT first_name, last_name FROM users INNER JOIN orders ON users.id = orders.user_id';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get users with orders: ${err}`);
    }
  }

  async fiveMostExpensive (): Promise<{ name: string, price: number }[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products by price: ${err}`);
    }
  }

  async currentOrder (id: string): Promise<{ productId: string, quantity: string, userId: string; status: string }[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT order_products.id, product_id, quantity, user_id , status FROM order_products LEFT JOIN orders ON order_products.order_id = orders.id WHERE user_id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to retrieve orders by user id ${id}: ${err}`);
    }
  }
}
