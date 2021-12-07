import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Create the pool, using mysql2 - https://www.npmjs.com/package/mysql2
 */
var pool: mysql.Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Connection database class
 */
class DatabaseConnection {
  static async getConnection(): Promise<mysql.Pool> {
    return pool;
  }
}

export default DatabaseConnection;
