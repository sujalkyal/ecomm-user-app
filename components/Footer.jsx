import { Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Subscribe Section */}
        <div>
          <h3 className="text-lg font-semibold">Exclusive</h3>
          <p className="mt-2 text-gray-400">Subscribe</p>
          <p className="text-sm text-gray-500">Get 10% off your first order</p>
          <div className="mt-3 flex items-center border border-gray-500 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 bg-black text-white focus:outline-none"
            />
            <button className="bg-white text-black p-2">
              <Mail size={20} />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold">Support</h3>
          <div className="mt-2 text-gray-400">
            <p>111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh.</p>
            <p className="text-sm text-gray-500">exclusive@gmail.com</p>
            <p className="text-sm text-gray-500">+88015-88888-9999</p>
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h3 className="text-lg font-semibold">Account</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Link</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>Privacy Policy</li>
            <li>Terms Of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Download App & Social Media */}
        <div>
          <h3 className="text-lg font-semibold">Download App</h3>
          <p className="mt-2 text-gray-400">Save $3 with App New User Only</p>
          <div className="mt-3 flex space-x-2">
            <img
              src="/qr-code.png"
              alt="QR Code"
              className="w-16 h-16 bg-white p-1"
            />
            <div className="flex flex-col space-y-2">
              <img src="/google-play.png" alt="Google Play" className="w-7" />
              <img src="/app-store.jpeg" alt="App Store" className="w-7" />
            </div>
          </div>
          <div className="mt-4 flex space-x-4 text-gray-400">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-white" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-white" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-white" />
            <Linkedin className="w-5 h-5 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
