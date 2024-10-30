import { pool } from '../../../common/config/db.js';

class URLshortnerModel{
    static async createShortUrl(originalUrl, shortUrl) {
        const connection = await pool.getConnection();
        try {
            const query = 'INSERT INTO urls (original_url, short_url) VALUES (?, ?)';
            const [result] = await connection.query(query, [originalUrl, shortUrl]);
            return result.affectedRows === 1;
        } finally {
            connection.release();
        }
    }
    static async getOriginalUrl(shortUrl) {
        const connection = await pool.getConnection();
        try {
            const query = 'SELECT original_url FROM urls WHERE short_url = ?';
            console.log(`Executing query: ${query} with shortUrl: ${shortUrl}`);
            const [rows] = await connection.query(query, [shortUrl]);
            console.log('rows : -------------    ', rows);
            if (rows.length === 0) {

                throw new Error('URL not found in model');
            }
            return rows[0].original_url;
        } finally {
            connection.release();
        }
    }
}

// Export the class
export default URLshortnerModel;