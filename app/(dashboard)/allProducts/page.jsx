"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../../components/ProductCard";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/getAllProducts`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/wishlist/getAllItems`)
      .then(({ data }) => setWishlist(data.map(item => item.id) || []))
      .catch((error) => console.error("Error fetching wishlist:", error));
  }, []);

  return (
    <div className="p-10  mx-auto">
  {/* Header Section */}
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold">All Products</h2>
  </div>

  {/* Divider */}
  <div className="border-t border-gray-200 my-4"></div>

  {/* Products Grid */}
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
</div>

  );
}
