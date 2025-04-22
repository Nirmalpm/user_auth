import axios from "axios";
export const getFreeNews = async (req, res) => {
  const { category } = req.query || "Sports";
  const url = `https://www.api.thefreenewsapi.com/api/news/v1?apiKey=6aa06-4b342-c0562-2c1ac-8f07c&category=${category}
		&sort=DESC&language=English&sourceCountry=UnitedStates&max=10`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data.member);
  } catch (error) {
    console.log("Error on accessing apidata:", error);
  }
};
