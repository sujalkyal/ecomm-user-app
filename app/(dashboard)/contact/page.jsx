import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
        
      {/* Hero Section */}
      <section className="bg-gray-100 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
        <p className="text-gray-600 mt-2">We’d love to hear from you. Contact us for any inquiries or support.</p>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-12">
        {/* Contact Form */}
        <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-red-300"
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <FaEnvelope className="text-red-500 text-2xl" />
            <div>
              <p className="text-gray-700">Email</p>
              <p className="text-gray-600">contact@exclusive.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <FaPhone className="text-red-500 text-2xl" />
            <div>
              <p className="text-gray-700">Phone</p>
              <p className="text-gray-600">+1 234 567 890</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <FaMapMarkerAlt className="text-red-500 text-2xl" />
            <div>
              <p className="text-gray-700">Location</p>
              <p className="text-gray-600">123 Street, City, Country</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
