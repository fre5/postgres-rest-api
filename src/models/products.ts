// @ts-ignore
import Client from '../database';

export type Product = {
  id?: string;
  name: string;
  price: string;
}

export class ProductStore {
  async index (): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to retrieve products: ${err}`);
    }
  }

  async show (id: string): Promise<Product> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to show product with id: ${id}. ${err}`);
    }
  }

  async create (name: string, price: string): Promise<Product> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [name, price]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to add product ${name} with price ${price}. ${err}`);
    }
  }
}
