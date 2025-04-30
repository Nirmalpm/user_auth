import axios from "axios";
import db from "../db/connectVYMySQLDB.js";

export const visitorLogger = () => {
  return async (req, res, next) => {
    const username = req.body?.email || "Guest";
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // console.log("IP", ip, "Username:", username, req.body?.password);

    // If the username is an email, strip out the part before the '@' symbol
    // if (username.includes("@")) {
    //   username = username.split("@")[0]; // Extract the part before '@'
    // }

    if (
      ip === "::1" ||
      ip === "127.0.0.1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.16.") ||
      ip.startsWith("172.31.")
    ) {
      console.log("Local or private access detected — skipping geo lookup.");
    } else {
      try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        if (response.data.status === "success") {
          console.log("Geo Info:", response.data);

          // Check if the status is 'success' before proceeding
          if (response.data.status !== "success") {
            console.log(
              `Geo lookup failed for IP ${ip}: ${response.data.message}`
            );
            return;
          }

          // Extracting the data from the response
          const data = response.data;

          const query = `
          INSERT INTO visitor_geo_logs (
            status, country, country_code, region, region_name, city, zip,
            lat, lon, timezone, isp, org, as_info, ip_address, username 
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
          const values = [
            data.status,
            data.country,
            data.countryCode,
            data.region,
            data.regionName,
            data.city,
            data.zip,
            data.lat,
            data.lon,
            data.timezone,
            data.isp,
            data.org,
            data.as,
            data.query,
            username,
          ];
          await db.execute(query, values);
          console.log(`Geo info for ${ip} logged to DB!`);
        } else {
          console.log("Geo Lookup Failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Geo Info:", error.message);
      }
    }
    next();
  };
};
