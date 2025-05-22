import axios from "axios";
import db from "../db/connectVYMySQLDB.js";
import jwt from "jsonwebtoken";

// Known bad User-Agents or tools attackers use
const blockedAgents =
  /(masscan|sqlmap|nmap|nikto|acunetix|curl|wget|fuzzer|scanner)/i;

export const visitorLogger = () => {
  return async (req, res, next) => {
    const { page } = req.query || null;
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // console.log("req.cookies:", req.cookies.token);
    //console.log("page:", page);
    // //console.log("IP", ip, "Username:", username, req.body?.password);
    // if (!page) return;
    // console.log("page:", page);
    // If the username is an email, strip out the part before the '@' symbol
    // if (username.includes("@")) {
    //   username = username.split("@")[0]; // Extract the part before '@'
    // }
    const userAgent = req.headers["user-agent"] || "";

    // Reject dangerous/missing User-Agents
    if (!userAgent || blockedAgents.test(userAgent)) {
      console.warn(
        `⚠️ Blocked request from IP ${ip} with User-Agent: ${userAgent}`
      );
      return res.status(403).send("Forbidden — suspicious request detected.");
    }

    if (
      ip === "::1" ||
      ip === "127.0.0.1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.16.") ||
      ip.startsWith("172.31.")
    ) {
      //console.log("Local or private access detected — skipping geo lookup.");
    } else {
      try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);

        if (response.data.status === "success") {
          //console.log("Geo Info:", response.data);

          // Check if the status is 'success' before proceeding
          if (response.data.status !== "success") {
            console.log(
              `Geo lookup failed for IP ${ip}: ${response.data.message}`
            );
            return;
          }

          // Extracting the data from the response
          const data = response.data;
          const token = req.cookies.token;
          let email = "Guest";
          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            email = decoded.email;
          }

          const query = `
          INSERT INTO visitor_geo_logs (
            status, country, country_code, region, region_name, city, zip,
            lat, lon, timezone, isp, org, as_info, ip_address, username, visited_page
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            email,
            page,
          ];
          if (page) {
            await db.execute(query, values);
          }
          //console.log(`Geo info for ${ip} logged to DB!`);
        } else {
          //console.log("Geo Lookup Failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Geo Info:", error.message);
      }
    }
    next();
  };
};
