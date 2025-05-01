import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/admin"
    : "/admin";

const AdminContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${API_URL}/send-error`, {
          name:formData.name,
          email:formData.email,
          content:formData.content,
        });
        toast.success(`Email sent successfully`);
      } catch (error) {        
        throw error;
      }
  };
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center py-20 mx-5 top-20"
    >
        <div className="px-4 w-100 border-gray-400 border-1 rounded-xl">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            Get In Touch
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-gray-400 border 
                        border-white/10 rounded px-4 py-3 text-gray-800 transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Name..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-gray-400  border 
                        border-white/10 rounded px-4 py-3 text-gray-800 transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <textarea
                id="content"
                name="content"
                rows={5}
                required
                className="w-full bg-gray-400 border 
                        border-white/10 rounded px-4 py-3 text-gray-800 transition focus:outline-none focus:border-blue-500 focus:bg-blue-500/5"
                placeholder="Your message..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded 
                    font-medium transition relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              Send Message
            </button>
          </form>
        </div>
    </section>
  );
};

export default AdminContact;
