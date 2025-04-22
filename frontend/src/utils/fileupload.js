import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/fileupload/upload"
    : "/fileupload/upload";

export const uploadImage = async (file, username) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `${API_URL}?username=${encodeURIComponent(username)}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();

  console.log("Uploaded image path:", data.filePath);

  return data;
};
