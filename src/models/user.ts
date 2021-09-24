// @ts-ignore
import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

const saltRounds: string = process.env.SALT_ROUNDS as string;
const pepper: (string|undefined) = process.env.BCRYPT_PASSWORD;

export class UserStore {
  async index (): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error('Unable to get list of users');
    }
  }

  async show (id: string): Promise<User> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to show user ${id}: ${err}`);
    }
  }

  async create (u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const checksql = 'SELECT username FROM users WHERE username=($1)';
      const checkResult = await conn.query(checksql, [u.username]);
      const checkUser = checkResult.rows[0];

      if (!checkUser) {
        const sql = 'INSERT INTO users (first_name, last_name, username, password_digest) VALUES ($1, $2, $3, $4) RETURNING *';
        const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));

        const result = await conn.query(sql, [u.firstName, u.lastName, u.username, hash]);
        const user = result.rows[0];
        conn.release();
        return user;
      } else {
        conn.release();
        console.log('Username is not available');
        throw new Error('Username is not available');
      }
    } catch (err) {
      throw new Error(`Unable to create user (${u.username}): ${err}`);
    }
  }

  async authenticate (username: string, password: string): Promise<User|null> {
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'SELECT password_digest, id FROM users WHERE username=($1)';
    const result = await conn.query(sql, [username]);
    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user;
      }
    }
    return null;
  }

  async update (username: string, password: string): Promise<User|null> {
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'UPDATE users SET password_digest = ($1) WHERE username = ($2) RETURNING id, password_digest';
    const hash = bcrypt.hashSync(password + pepper, parseInt(saltRounds));
    const result = await conn.query(sql, [hash, username]);
    const user = result.rows[0];
    conn.release();
    return user;
  }

  async remove (username: string): Promise<void> {
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'DELETE FROM users WHERE username=($1)';
    const result = await conn.query(sql, [username]);
    const user = result.rows[0];
    conn.release();
    return user;
  }
}
