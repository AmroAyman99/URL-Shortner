import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();
// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to get a connection from the pool
async function getConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("DB connected");
        return connection;
    } catch (err) {
        console.error("DB connection error:", err);
        throw err;
    }
}

export { getConnection, pool };