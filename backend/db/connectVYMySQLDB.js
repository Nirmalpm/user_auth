import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Important

const connection = mysql2.createConnection({
  host: process.env.MYSQL_URL, // or external IP/domain
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // number of connections
  queueLimit: 0,
});

connection.connect((err) => {
  if (err) {
    console.error("Connection failed:", err);
    return;
  }
  console.log("Connected to MySQL on SpidyHost!");
  // 👇 Keep-alive ping every 5 seconds
  setInterval(() => {
    connection.query("SELECT 1", (err) => {
      if (err) {
        console.error("MySQL keep-alive failed:", err);
        // } else {
        //   console.log("💓 MySQL keep-alive ping");
        // }
      }
    });
  }, 5000);
});

export default connection.promise();
