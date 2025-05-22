import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cron from "node-cron";
import db from "./db/connectVYMySQLDB.js";

// Initialize WhatsApp client
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp Client is ready!");

  // Schedule cron job — runs every day at 9 AM
  cron.schedule("35 15 * * *", async () => {
    console.log("🎉 Checking for today's birthdays...");

    try {
      // Fetch today’s birthdays
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      const [rows] = await db.execute(
        `SELECT name, phoneNumber FROM user WHERE MONTH(birthday) = ? AND DAY(birthday) = ?`,
        [month, day]
      );

      if (rows.length === 0) {
        console.log("No birthdays today.");
        return;
      }

      rows.forEach((user) => {
        const message = `🎂 Happy Birthday, ${user.name}! 🎉 Wishing you an amazing year ahead.`;

        // WhatsApp number format: <number>@c.us
        const number = `${user.phoneNumber}@c.us`;

        client
          .sendMessage(number, message)
          .then(() => {
            console.log(`✅ Birthday message sent to ${user.phoneNumber}`);
          })
          .catch((err) => {
            console.error(`❌ Failed to send to ${user.phoneNumber}:`, err);
          });
      });
    } catch (error) {
      console.error("❌ Error fetching birthdays:", error);
    }
  });
});

// Start WhatsApp client
client.initialize();
