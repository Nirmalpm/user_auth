import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/blogs"
    : "/api/blogs";

export const useBlogStore = create((set, get) => ({
  blogs: [],
  selectedBlog: {},
  blogDiscussion: [],
  saveBlog: async (blog) => {
    //console.log(blog);
    try {
      const response = await axios.post(`${API_URL}/saveBlog`, blog);
      set({
        blogs: response.data.blogs,
      });
      //console.log(response.data.blogs);
      return response.data.blogs;
    } catch (error) {
      //console.log(error);
      throw new Error(error.response.data.message);
    }
  },
  getBlogs: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAllDisplayBlogs`);
      set({
        blogs: response.data.blogs,
      });
      //console.log(response.data.blogs);
      return response.data.blogs;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  getBlogById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/getBlogs?id=${id}`);
      const blog = response.data.blogs[0];
      //console.log(blog);
      // Access current selectedBlog using get()
      const currentBlogs = get().selectedBlog;
      set({
        selectedBlog: { [id]: blog },
      });
      return blog;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteBlog: async (id, user, authorId) => {
    try {
      const response = await axios.post(`${API_URL}/deleteBlog`, {
        id,
        user,
        authorId,
      });
      set({
        blogs: response.data.blogs,
      });
      //console.log(response.data.blogs);
      return response.data.blogs;
    } catch (error) {
      throw error;
    }
  },
  saveBlogComment: async (comment) => {
    //console.log(comment);
    try {
      const response = await axios.post(`${API_URL}/saveBlogComment`, comment);
      set({
        blogDiscussion: response.data.discussion,
      });
      //console.log(response.data.discussion);
      return response.data.discussion;
    } catch (error) {
      //console.log(error);
      throw new Error(error.response.data.message);
    }
  },
  getComments: async (blogId) => {
    try {
      const response = await axios.get(
        `${API_URL}/getComments?blogId=${blogId}`
      );
      set({
        blogDiscussion: response.data.discussion,
      });
      //console.log(response.data.discussion);
      return response.data.discussion;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteComment: async (id, blogId, user, commentUserId) => {
    //console.log(id, blogId, user, commentUserId)
    try {
      const response = await axios.post(`${API_URL}/deleteComment`, {
        id,
        blogId,
        user,
        commentUserId,
      });
      set({
        blogDiscussion: response.data.discussion,
      });
      //console.log(response.data.discussion);
      return response.data.discussion;
    } catch (error) {
      //console.log(error)
      throw error;
    }
  },
}));
