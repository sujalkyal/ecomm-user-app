"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Carousel from "../components/imageCarousel";
import ProductCard from "../components/ProductCard";
import CategorySection from "../components/CategorySection";
import FeatureCard from "../components/FeatureCard";

const categories = {
  "Electronics": "electronics",
  "Fashion": "fashion",
  "Home & Lifestyle": "home-lifestyle",
  "Sports & Outdoor": "sports-outdoor",
  "Baby's & Toys": "babys-toys",
  "Groceries & Pets": "groceries-pets",
  "Health & Beauty": "health-beauty",
};

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [newlyAddedProducts, setNewlyAddedProducts] = useState([]);

  // Redirect unauthenticated users before rendering UI
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/api/auth/signin"); // Use replace to prevent back navigation
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchData = async () => {
      try {
        const [bestSelling, allProducts, newlyAdded, wishlist] = await Promise.all([
          axios.get("/api/product/getBestSelling"),
          axios.get("/api/product/getAllProducts"),
          axios.get("/api/product/getNewlyAddedProducts"),
          axios.get("/api/user/wishlist/getAllItems"),
        ]);

        setBestSellingProducts(bestSelling.data.products);
        setAllProducts(allProducts.data);
        setNewlyAddedProducts(newlyAdded.data);
        setWishlist(wishlist.data.map((item) => item.id) || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [status]);

  const handleCategoryClick = (categoryUrl) => {
    router.push(`/collection/${encodeURIComponent(categoryUrl)}`);
  };

  // Show loading UI while session is being checked
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600">Checking session...</p>
      </div>
    );
  }

  // Prevent UI rendering if redirecting to login
  if (status === "unauthenticated") return null;

  return (
    <>
      <div className="flex w-full px-10 py-8 space-x-6">
        <aside className="w-1/5 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
          <ul className="space-y-3">
            {Object.entries(categories).map(([displayName, categoryUrl], index) => (
              <li
                key={index}
                onClick={() => handleCategoryClick(categoryUrl)}
                className="text-gray-700 cursor-pointer hover:text-black transition"
              >
                {displayName}
              </li>
            ))}
          </ul>
        </aside>
        <div className="w-[1px] bg-gray-300"></div>
        <div className="flex-grow my-auto">
          <Carousel />
        </div>
      </div>

      <hr className="border-gray-300 my-6 w-[90%] mx-auto" />

      <div className="px-10 py-6 space-y-10">
        <section className="w-full bg-white p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Best Selling Products</h2>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} setWishlist={setWishlist} />
            ))}
          </div>
        </section>

        <hr className="border-gray-300 w-[90%] mx-auto" />

        <section className="w-full bg-white p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">All Products</h2>
            <button
              onClick={() => router.push("/allProducts")}
              className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allProducts.slice(0,5).map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} setWishlist={setWishlist} />
            ))}
          </div>
        </section>

        <hr className="border-gray-300 w-[90%] mx-auto" />
        <CategorySection />
        <hr className="border-gray-300 w-[90%] mx-auto" />

        <section className="w-full bg-white p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Newly Added Products</h2>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {newlyAddedProducts.map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} setWishlist={setWishlist} />
            ))}
          </div>
        </section>

        <FeatureCard />
      </div>
    </>
  );
}