"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import ProductCard from "../../../components/ProductCard";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/wishlist/removeItem`, { productId });
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/wishlist/getAllItems`);
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };
    fetchWishlist();
  }, []);

  const handleMoveAllToBag = async () => {
    if (wishlist.length === 0) return;

    try {
      const productIds = wishlist.map((product) => product.id);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addMultipleToCart`, { productIds });
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/wishlist/clearAll`);
      setWishlist([]);
    } catch (error) {
      console.error("Error moving wishlist items to cart:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Wishlist</h2>
          <button
            onClick={handleMoveAllToBag}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hover:cursor-pointer"
            disabled={loading || wishlist.length === 0}
          >
            Move All To Bag
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading wishlist...</p> // Show loading indicator
        ) : wishlist.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard
                  product={product}
                  wishlist={wishlist.map((item) => item.id)}
                  setWishlist={setWishlist}
                  onRemoveWishlist={handleRemoveFromWishlist}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:cursor-pointer"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
