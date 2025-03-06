import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const CartItem = ({ product, quantity, onRemove, onQuantityChange }) => {
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleUpdateQuantity = async (increase) => {
    try {
      const updatedQuantity = increase ? itemQuantity + 1 : itemQuantity - 1;
      if (updatedQuantity < 1) return; // Prevent quantity from going below 1

      await axios.post("/api/user/addToCart", {
        productId: product.id,
        choice: increase, // true for add, false for subtract
      });

      setItemQuantity(updatedQuantity);
      onQuantityChange(); // ✅ Trigger re-fetch of cart details after update
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await axios.delete("/api/user/deleteitemcart", { data: { productId: product.id } }); // ✅ Corrected DELETE request
      onQuantityChange(); // ✅ Refresh cart after item removal
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="relative grid grid-cols-6 items-center bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 gap-6">
      
      {/* Product Image */}
      <div className="relative col-span-1">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-xl shadow-md border border-gray-300"
        />
        <button
          onClick={handleRemove}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Product Name */}
      <span className="text-lg font-semibold text-gray-800 col-span-2">{product.name}</span>

      {/* Product Price */}
      <span className="text-lg font-semibold text-gray-800 tracking-wide col-span-1">
        ${product.price.toFixed(2)}
      </span>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3 col-span-1">
        <button
          onClick={() => handleUpdateQuantity(false)}
          className="p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md transition-all duration-300 active:scale-90 cursor-pointer"
        >
          <Minus size={20} />
        </button>
        <span className="px-5 py-2 text-lg font-semibold border border-gray-400 bg-gray-100 rounded-lg shadow-sm">
          {itemQuantity}
        </span>
        <button
          onClick={() => handleUpdateQuantity(true)}
          className="p-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg shadow-md transition-all duration-300 active:scale-90 cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Total Price */}
      <span className="text-lg font-semibold text-gray-900 tracking-wide col-span-1">
        ${(product.price * itemQuantity).toFixed(2)}
      </span>
    </div>
  );
};

export default CartItem;
