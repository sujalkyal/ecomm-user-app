"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import CartItem from "../../../components/CartItem";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const shippingCost = 0;
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getCartDetails`);
      setCart(response.data.result);
      setSubtotal(response.data.totalAmount);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [updateTrigger]);

  const handleCartUpdate = () => {
    setUpdateTrigger((prev) => !prev);
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/deleteitemcart/${productId}`);
      handleCartUpdate();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = async () => {
    // Prepare the cart data by extracting only productId and quantity
    const filteredCart = cart.map(({ productId, quantity }) => ({ productId, quantity }));

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/checkStock`, {filteredCart});

        if (response.data.success) {
            localStorage.setItem("checkoutProducts", JSON.stringify(cart));
            router.push("/cart/checkout");
        } else {
          const outOfStockNames = response.data.outOfStock.map(item => item.name).join(", ");
          toast.error(`Out of stock: ${outOfStockNames}`);
        }
    } catch (error) {
        console.error("Error during checkout:", error);
        toast.error("Failed to check stock. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-gray-500">
        Loading...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-4xl font-bold text-gray-500">Your Cart Is Empty</h2>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="grid gap-4">
        {cart.map(({ product, quantity }) => (
          <CartItem
            key={product.id}
            product={product}
            quantity={quantity}
            onRemove={handleRemove}
            onQuantityChange={handleCartUpdate}
          />
        ))}
      </div>

      <div className="mt-8 p-6 border rounded-lg shadow-md w-96">
        <h3 className="text-lg font-semibold mb-4">Cart Total</h3>
        <p className="flex justify-between">
          <span>Subtotal:</span> <span>${subtotal.toFixed(2)-20}</span>
        </p>
        <p className="flex justify-between">
        <span>Platform Fee:</span> <span>$20</span>
        </p>
        <p className="flex justify-between">
          <span>Shipping:</span> <span>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span>
        </p>
        <hr className="my-3" />
        <p className="flex justify-between font-bold text-lg">
          <span>Total:</span> <span>${(subtotal + shippingCost).toFixed(2)}</span>
        </p>
        <button 
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:cursor-pointer"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
