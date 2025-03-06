"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay , Navigation, Pagination } from "swiper/modules";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]); // ✅ Stores all reviews
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!id || !isHydrated) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/product/${encodeURIComponent(id)}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/reviews/${id}`); // ✅ Fetch reviews separately
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const checkCart = async () => {
      try {
        const response = await axios.get("/api/user/getCartDetails");
        const cartItems = response.data.result || [];
        setInCart(cartItems.some((item) => item.product.id === id));
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };

    fetchProduct();
    fetchReviews();
    checkCart();
  }, [id, isHydrated]);

  if (!isHydrated || !product) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  if (!product.image || product.image.length === 0) return <p className="text-center text-gray-500 text-lg">No images available</p>;

  const isWishlisted = wishlist.includes(product.id);

  const toggleWishlist = async () => {
    try {
      const endpoint = isWishlisted
        ? "/api/user/wishlist/removeItem"
        : "/api/user/wishlist/addItem";
      await axios.post(endpoint, { productId: product.id });
      setWishlist((prev) =>
        isWishlisted ? prev.filter((pid) => pid !== product.id) : [...prev, product.id]
      );
    } catch (error) {
      console.error("Wishlist update error:", error);
    }
  };

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await axios.post("/api/user/addToCart", { productId: product.id, choice: true });
      setInCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }

    setLoading(false);
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post("/api/user/addReview", {
        productId: product.id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      if (response.status === 201) {
        setReviews([...reviews, response.data.review]); // ✅ Update reviews dynamically
        setNewReview({ rating: 5, comment: "" }); // Reset input fields
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const averageRating = reviews.length
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : "No Ratings";
  return (
    <div className="container mx-auto p-6 md:p-12 max-w-7xl">
      <div className="flex flex-col md:flex-row bg-white p-10 shadow-xl rounded-3xl">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <Swiper
            navigation
            pagination={{ clickable: true }}
            loop={true} // ✅ Enables infinite looping
            autoplay={{ delay: 3000, disableOnInteraction: false }} // ✅ Changes slide every 1.5 seconds
            modules={[Autoplay, Navigation, Pagination]}
            className="w-full rounded-xl shadow-lg"
          >
            {(Array.isArray(product.image) ? product.image : [product.image]).map((img, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={img}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="rounded-xl object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>;
        </div>
        {/* Product Info Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between px-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600">{averageRating} ⭐ ({reviews.length} reviews)</p>
            <p className="text-3xl font-semibold text-gray-800 mt-4">${product.price}</p>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>
          {/* Buttons */}
          <div className="mt-8 space-y-4">
            <button
              className={`w-full px-6 py-4 text-white text-xl font-bold rounded-xl shadow-md transition-all hover:cursor-pointer ${inCart ? "bg-black hover:bg-gray-800" : "bg-red-500 hover:bg-red-600"}`}
              onClick={() => (inCart ? router.push("/cart") : handleAddToCart())}
              disabled={loading}
            >
              {loading ? "Processing..." : inCart ? "Move to Cart" : "Add to Cart"}
            </button>
            <button onClick={toggleWishlist} className="w-full p-4 border rounded-xl flex justify-center items-center space-x-3 hover:shadow-lg transition-all hover:cursor-pointer">
              <FaHeart className={`text-3xl ${isWishlisted ? "text-red-500" : "text-gray-400"}`} />
              <span className="text-lg font-medium">{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>
          <div className="mt-6 border p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Add Your Review</h3>
            <select className="w-full border p-2 rounded mt-2" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>{star} Stars</option>
              ))}
            </select>
            <textarea className="w-full border p-2 rounded mt-2" placeholder="Write your review..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}></textarea>
            <button onClick={handleReviewSubmit} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer">Submit Review</button>
          </div>
          {/* Review Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="mt-4 space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border p-4 rounded-lg shadow-sm">
                    {/* <p className="text-lg font-semibold">{review.user?.id || "Anonymous"}</p> */}
                    <p className="text-yellow-500 text-lg">{"★".repeat(review.rating)}</p>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}