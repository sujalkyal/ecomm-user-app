"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import { Eye } from "lucide-react";
import axios from "axios";

export default function ProductCard({ product, wishlist = [], setWishlist, updateCart }) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inCart, setInCart] = useState(false); // ✅ State to track if the item is in the cart

  const router = useRouter();
  if (!product) return null;

  const productImage = product?.image?.length > 0 ? product.image[0] : "/placeholder.png";
  const reviews = product?.reviews || [];
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length : 0;

  const [isWishlisted, setIsWishlisted] = useState(wishlist.includes(product.id));

  useEffect(() => {
    setIsWishlisted(wishlist.includes(product.id));
  }, [wishlist]);


  // ✅ Check if the product is already in the cart when the component mounts
  useEffect(() => {
    const checkCart = async () => {
      try {
        const response = await axios.get("/api/user/getCartDetails");
        const cartItems = response.data.result || [];
        setInCart(cartItems.some((item) => item.product.id === product.id));
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };
    checkCart();
  }, []);

  const handleProductClick = () => {
    router.push(`productdesc/${product.id}`);
  };

  const toggleWishlist = async (e) => {
    if (loading) return;
    setLoading(true);

    try {
      if (isWishlisted) {
        await axios.post("/api/user/wishlist/removeItem", { productId: product.id });
        setWishlist((prev) => prev.filter((item) => item !== product.id));
      } else {
        await axios.post("/api/user/wishlist/addItem", { productId: product.id });
        setWishlist((prev) => [...prev, product.id]);
      }
    } catch (error) {
      console.error("Wishlist update error:", error);
    }
    setLoading(false);
  };
  
  
  const handleAddToCart = async () => {
    try {
      await axios.post("/api/user/addToCart", { productId: product.id, choice: true });
      if (updateCart) {
        updateCart();
      }
      setInCart(true); // ✅ Mark product as added to cart
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="p-4 w-72 bg-white rounded-xl shadow-md relative">
      <div
        className="relative w-full overflow-hidden rounded-lg cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleProductClick}
      >
        <img src={productImage} alt={product?.name || "Product"} className="w-full h-64 object-cover" />

        {/* {hovered && (
          <button
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-md hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              inCart ? router.push("/cart") : handleAddToCart();
            }}
          >
            {inCart ? "Move to Cart" : "Add to Cart"}
          </button>
        )} */}

<div className="absolute top-2 right-2 flex flex-col gap-2 pointer-events-auto">
  <button
    className={`p-3 bg-white rounded-full shadow-md hover:cursor-pointer ${
      isWishlisted ? "text-red-500" : "text-gray-400"
    }`}
    onClick={(e) => {
      e.stopPropagation();
      toggleWishlist();
    }}
    disabled={loading}
    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
  >
    <FaHeart size={18} />
  </button>
</div>

      </div>

      <h3 className="mt-4 text-lg font-semibold">{product?.name || "Unnamed Product"}</h3>

      <div className="flex items-center gap-2 mt-1">
        <span className="text-red-500 text-lg font-bold">${product?.price || 0}</span>
        <span className="text-gray-400 line-through">${(product?.price*1.50 || 0)}</span>
      </div>

      <div className="flex items-center gap-1 mt-1">
        <span className="text-yellow-500 text-lg">
          {"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}
        </span>
        <span className="text-gray-600">({reviews.length})</span>
      </div>

      <p className={`mt-2 text-sm ${product?.stock > 0 ? "text-green-600" : "text-red-500"}`}>
        {product?.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
      </p>

      {/* ✅ Add button outside hover effect for mobile users */}
      <button
        className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md shadow-md hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          inCart ? router.push("/cart") : handleAddToCart();
        }}
      >
        {inCart ? "Move to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
