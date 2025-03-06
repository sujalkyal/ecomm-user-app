import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    image: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
    title: "iPhone 14 Series",
    subtitle: "Up to 25% off Voucher",
    buttonText: "Shop Now",
  },
  {
    image: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    title: "iPhone 13 Series",
    subtitle: "Special Discount Available",
    buttonText: "Explore",
  },
  {
    image: "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    title: "Apple Accessories",
    subtitle: "Save Big on Bundles",
    buttonText: "Discover",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  // Autoplay effect (changes image every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 relative text-white bg-black">
            <Image src={slide.image} alt={slide.title} width={1200} height={300} className="w-full object-cover" />
            <div className="absolute top-1/4 left-10">
              <h2 className="text-lg font-semibold">{slide.title}</h2>
              <p className="text-4xl font-bold mt-2">{slide.subtitle}</p>
              <button className="mt-4 px-6 py-2 bg-white text-black rounded-md hover:bg-gray-300">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-5 top-1/2 -translate-y-1/2 btn btn-circle">❮</button>
      <button onClick={nextSlide} className="absolute right-5 top-1/2 -translate-y-1/2 btn btn-circle">❯</button>
      <div className="absolute bottom-5 flex justify-center w-full gap-2">
        {slides.map((_, index) => (
          <span key={index} className={`h-3 w-3 rounded-full ${current === index ? 'bg-red-500' : 'bg-gray-500'}`}></span>
        ))}
      </div>
    </div>
  );
}
