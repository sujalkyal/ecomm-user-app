"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function CategoryProductsPage({ category }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // 🔹 Start loading
      try {
        const response = await axios.get(`/api/product/collection?category=${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false); // 🔹 Stop loading
    };

    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get("/api/user/wishlist/getAllItems");
        setWishlist(data.map((item) => item.id) || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [category]);

  return (
    <div className="p-10 mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold capitalize">{category} Products</h2>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* 🔹 Show loader if loading */}
      {loading ? (
        <div className="text-center text-lg font-medium text-gray-600 py-10">
          Loading products...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                wishlist={wishlist} 
                setWishlist={setWishlist} 
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No products available.</p>
          )}
        </div>
      )}
    </div>
  );
}
