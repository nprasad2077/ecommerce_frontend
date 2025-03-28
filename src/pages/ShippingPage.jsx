import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShippingPage() {
  const [form, setForm] = useState({
    address: "", city: "", postalCode: "", country: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("shipping", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button className="w-full bg-black text-white py-2 rounded">Continue</button>
      </form>
    </div>
  );
}
