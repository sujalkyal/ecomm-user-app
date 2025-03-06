"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../../components/ProductCard.jsx";

const SearchedPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/getAllProducts`
        );
        if (response.status === 200) {
          const filteredProducts = response.data.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/wishlist/getAllItems`
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          setWishlist(response.data.map((item) => item.id));
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    if (query) {
      setLoading(true);
      Promise.all([fetchProducts(), fetchWishlist()]).finally(() =>
        setLoading(false)
      );
    }
  }, [query]);

  if (loading) {
    return <div className="p-6 text-center">Loading search results...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No products found.</p>
      )}
    </div>
  );
};

export default SearchedPage;
