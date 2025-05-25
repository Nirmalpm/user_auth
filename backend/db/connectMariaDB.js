import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config(); // load .env file

const pool = mariadb.createPool({
  host: process.env.HOST_URL,
  port: 3306,
  user: process.env.MARIA_DB_USER,
  password: process.env.MARIA_DB_PASSWORD,
  database: process.env.MARIA_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  bigIntAsString: true, // <-- important
});

// Function to test connection and set keep-alive
async function initConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("✅ Connected to MariaDB!");

    // Keep-alive ping every 5 seconds
    setInterval(async () => {
      try {
        await conn.query("SELECT 1");
        //console.log("💓 MariaDB keep-alive ping");
      } catch (err) {
        console.error("MariaDB keep-alive failed:", err);
      }
    }, 5000);
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

initConnection();

export default pool;
