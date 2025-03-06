"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CheckoutComponent = ({ products }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMode: "COD",
  });

  const subtotal = products.reduce(
    (acc, item) => acc + (item.product.price || 0) * (item.quantity || 1),
    0
  );
  const platformFee = 20;
  const shipping = 0;
  const total = subtotal + platformFee + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.email || !formData.street || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const orderDetails = {
        products: products.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        name: formData.name,
        email: formData.email,
        address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zip}`,
        phone: formData.phone,
        paymentMode: formData.paymentMode,
        amount: total,
      };

      const response = await axios.post("/api/user/addOrder", orderDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(response.data.success === false) {
        toast.error(response.data.message);
        router.push("/cart");
        return;
      }

      toast.success("Order placed successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="checkout-container max-w-5xl mx-auto p-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <nav className="text-sm text-gray-500 mb-4">
          Account / My Account / Product / View Cart /
          <span className="font-semibold text-black"> CheckOut</span>
        </nav>
        <h2 className="text-2xl font-bold mb-6">Billing Details</h2>
        <form className="grid grid-cols-1 gap-4">
          <input type="text" name="name" placeholder="Full Name*" className="border p-3 w-full" value={formData.name} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email Address*" className="border p-3 w-full" value={formData.email} onChange={handleInputChange} required />
          <input type="text" name="street" placeholder="Street Address*" className="border p-3 w-full" value={formData.street} onChange={handleInputChange} required />
          <input type="text" name="city" placeholder="City*" className="border p-3 w-full" value={formData.city} onChange={handleInputChange} required />
          <input type="text" name="state" placeholder="State*" className="border p-3 w-full" value={formData.state} onChange={handleInputChange} required />
          <input type="text" name="zip" placeholder="ZIP Code*" className="border p-3 w-full" value={formData.zip} onChange={handleInputChange} required />
          <input type="tel" name="phone" placeholder="Phone Number*" className="border p-3 w-full" value={formData.phone} onChange={handleInputChange} required />
        </form>
      </div>
      <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-md border">
        {products.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <img src={item.product.image?.[0] || "/placeholder-image.png"} alt={item.product.name || "Product Image"} className="w-10 h-10 object-cover rounded-md" />
            <span className="text-gray-700">{item.product.name || "Unnamed Product"}</span>
            <span className="text-gray-800 font-medium">${item.product.price.toFixed(2)} × {item.quantity}</span>
          </div>
        ))}
        <hr className="my-3" />
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Platform Fee:</span>
          <span>${platformFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping:</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="mt-6">
          <label className="flex items-center space-x-2">
            <input type="radio" name="paymentMode" value="Bank" className="form-radio" checked={formData.paymentMode === "Bank"} onChange={handleInputChange} />
            <span>Bank</span>
          </label>
          <label className="flex items-center space-x-2 mt-3">
            <input type="radio" name="paymentMode" value="COD" className="form-radio" checked={formData.paymentMode === "COD"} onChange={handleInputChange} />
            <span>Cash on delivery</span>
          </label>
        </div>
        <button className="mt-6 bg-red-500 text-white py-3 rounded-md w-full text-lg font-medium hover:cursor-pointer" onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default CheckoutComponent;
