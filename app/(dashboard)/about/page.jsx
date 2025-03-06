import FeatureCard from "../../../components/FeatureCard";

export default function AboutUs() {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">Home / About</nav>
  
        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-4">Our Story</h1>
            <p className="text-gray-600">
              Launched in 2015, Exclusive is South Africa’s premier online shopping marketplace with an active presence in 20+ locations.
              Backed by various range of tailored marketing, data and service solutions, Exclusive has had a 100% order growth and serves
              3 million customers each month.
            </p>
            <p className="text-gray-600 mt-4">
              Exclusive has more than 10 million products on offer, catering to a very fast audience in the diverse segments in categories ranging from consumers.
            </p>
          </div>
          <img src="/shopping.jpeg" alt="About Us" className="w-full rounded-lg" />
        </div>
  
        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {["10.5k Sellers on our site", "33k Monthly Products Sale", "45.5k Customers on our site", "25k Annual gross sale on our site"].map((stat, index) => (
            <div key={index} className="text-center border p-6 rounded-lg shadow transition duration-300 hover:bg-red-500 hover:text-white">
              <p className="text-xl font-bold">{stat.split(' ')[0]}</p>
              <p className="text-gray-500 hover:text-white">{stat.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>
  
        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[ 
            { name: "Tom Cruise", role: "Founder & Chairman", image: "/tom_cruise.jpeg" },
            { name: "Emma Watson", role: "Managing Director", image: "/emma_watson.jpeg" },
            { name: "Will Smith", role: "Product Designer", image: "/will_smith.jpeg" }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <img src={member.image} alt={member.name} className="w-48 h-48 mx-auto rounded-lg object-cover" />
              <h3 className="text-lg font-bold mt-4">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
  
        <FeatureCard />
      </div>
    );
}
