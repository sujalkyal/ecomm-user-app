
export default function FeatureCard() {
    const features = [
      {
        icon: "🚚", // You can replace this with an actual image or SVG
        title: "FREE AND FAST DELIVERY",
        description: "Free delivery for all orders over $140",
      },
      {
        icon: "🎧",
        title: "24/7 CUSTOMER SERVICE",
        description: "Friendly 24/7 customer support",
      },
      {
        icon: "✅",
        title: "MONEY BACK GUARANTEE",
        description: "We return money within 30 days",
      },
    ];
  
    return (
      <div className="flex justify-center gap-10 p-10 bg-white">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-3xl">
              {feature.icon}
            </div>
            <h3 className="mt-4 font-bold text-lg">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    );
  }
  