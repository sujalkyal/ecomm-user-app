"use client";
import { useRouter } from "next/navigation";
import { FiMonitor, FiShoppingBag, FiHome, FiActivity, FiHeart } from "react-icons/fi";

const categories = [
  { name: "Electronics", icon: <FiMonitor />, categoryRoute: "electronics" },
  { name: "Fashion", icon: <FiShoppingBag />, categoryRoute: "fashion" },
  { name: "Home & Lifestyle", icon: <FiHome />, categoryRoute: "home-lifestyle" },
  { name: "Sports & Outdoor", icon: <FiActivity />, categoryRoute: "sports-outdoor" },
  { name: "Health & Beauty", icon: <FiHeart />, categoryRoute: "health-beauty" },
];

const CategoryCard = ({ text, icon, categoryRoute }) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer transition 
                 bg-white text-black hover:bg-red-500 hover:text-white"
      onClick={() => router.push(`/collection/${categoryRoute}`)}
    >
      <div className="text-3xl">{icon}</div>
      <p className="font-medium mt-2">{text}</p>
    </div>
  );
};

const CategorySection = () => {
  return (
    <section className="w-full p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-red-500 font-medium">Categories</p>
          <h2 className="text-3xl font-bold">Browse By Category</h2>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {categories.map(({ name, icon, categoryRoute }) => (
          <CategoryCard key={name} text={name} icon={icon} categoryRoute={categoryRoute} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
