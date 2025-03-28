import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, Building, Map, Globe, ArrowRight, Truck } from "lucide-react";

export default function ShippingPage() {
  const [form, setForm] = useState({
    address: "", 
    city: "", 
    postalCode: "", 
    country: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Load saved shipping info if available
  useEffect(() => {
    const savedShipping = localStorage.getItem("shipping");
    if (savedShipping) {
      try {
        setForm(JSON.parse(savedShipping));
      } catch (e) {
        console.error("Failed to parse saved shipping info");
      }
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!form.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }
    
    if (!form.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    localStorage.setItem("shipping", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <MapPin size={16} />
            </div>
            <span className="text-xs mt-1 font-medium text-blue-600">Shipping</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className="h-full w-0 bg-blue-600"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
              2
            </div>
            <span className="text-xs mt-1 text-gray-500">Payment</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className="h-full w-0 bg-blue-600"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
              3
            </div>
            <span className="text-xs mt-1 text-gray-500">Review</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-1">
            <Truck className="w-5 h-5 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Shipping Information</h1>
          </div>
          <p className="text-gray-600 text-sm">Enter your shipping details to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Home className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="123 Main St, Apt 4B"
                  value={form.address}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="New York"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Map className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="10001"
                  value={form.postalCode}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border ${
                    errors.postalCode ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="United States"
                  value={form.country}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-red-600">{errors.country}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Continue to Payment
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}