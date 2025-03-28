import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/users/profile/").then((res) =>
      setForm({ name: res.data.name, email: res.data.email, password: "" })
    );
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/users/profile/update/", form);
      login(data); // Update context/localStorage
      setMessage("Profile updated!");
    } catch {
      setMessage("Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {message && <p className="text-sm mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Name"
        />
        <input
          name="email"
          value={form.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          className="w-full p-2 border rounded"
          placeholder="New Password"
        />
        <button className="w-full bg-black text-white py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
