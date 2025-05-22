import axios from "axios";
import sharp from "sharp";

export const getFreeNews = async (req, res) => {
  const { category } = req.query || "Sports";
  const url = `https://www.api.thefreenewsapi.com/api/news/v1?apiKey=6aa06-4b342-c0562-2c1ac-8f07c&category=${category}
		&sort=DESC&language=English&sourceCountry=UnitedStates&max=10`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data.member);
  } catch (error) {
    //console.log("Error on accessing apidata:", error);
  }
};

// export const getQuoteImageUrl = async (req, res) => {
//   const url = `https://inspirobot.me/api?generate=true`;

//   try {
//     const response = await axios.get(url);
//     res.status(200).json(response.data);
//   } catch (error) {
//     //console.log("Error on accessing apidata:", error);
//   }
// };

// export const getQuoteImageUrl = async (req, res) => {
//   try {
//     const response = await axios.get("https://zenquotes.io/api/image", {
//       responseType: "arraybuffer",
//     });
//     //const base64 = Buffer.from(response.data, "binary").toString("base64");
//     const compressed = await sharp(response.data)
//       .resize(400) // reduce width
//       .jpeg({ quality: 60 }) // compress quality
//       .toBuffer();
//     const base64 = compressed.toString("base64");
//     //console.log(base64);
//     res.status(200).json(base64);
//   } catch (error) {
//     console.error("Error fetching image:", error);
//   }
// };

export const getQuoteImageUrl = async (req, res) => {
  const response = await axios.get("https://zenquotes.io/api/image", {
    responseType: "stream",
  });
  res.setHeader("Content-Type", "image/jpeg");
  response.data.pipe(res);
};
