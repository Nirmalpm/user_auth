import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/fileupload"
    : "/fileupload";

export const uploadImage = async (file, username) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `${API_URL}/upload?username=${encodeURIComponent(username)}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();

  //console.log("Uploaded image path:", data.filePath);

  return data;
};

export const uploadDocImage = async (file, name) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `${API_URL}/upload_doc?name=${encodeURIComponent(name)}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();

  //console.log("Uploaded image path:", data.filePath);

  return data;
};
