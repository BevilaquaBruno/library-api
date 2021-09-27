import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

var pool: mysql.Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

class DatabaseConnection {
  static async getConnection(): Promise<mysql.Pool> {
    return pool;
  }
}

export default DatabaseConnection;
