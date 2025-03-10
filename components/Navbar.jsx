import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession, getSession } from "next-auth/react";
import { toast } from "react-toastify";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/searched?query=${encodeURIComponent(search)}`);
    }
  };

  useEffect(() => {
    setHydrated(true);
    if (status === "unauthenticated" && pathname !== "/auth/login") {
      router.push("/auth/signup");
    }
  }, [status, router]);

  const handleLogOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const handleNavigation = async (path) => {
    const userSession = await getSession();
    if (!userSession) {
      toast.error(`Please log in to access ${path.replace("/", "")}`, { position: "top-center" });
    } else {
      router.push(path);
    }
  };

  return (
    <header className="w-full border-b bg-white shadow-md">
      <nav className="flex justify-between items-center py-5 px-10">
        {/* Logo */}
        <button onClick={() => handleNavigation("/")}>
          <div className="text-3xl font-extrabold text-gray-800 tracking-wide cursor-pointer">
            KHARID <span className="text-red-500">LO</span>
          </div>
        </button>

        {/* Navigation Links */}
        <ul className="flex space-x-8 text-lg font-medium">
          <li>
            <button onClick={() => handleNavigation("/")} className="hover:text-red-500 transition hover:cursor-pointer">
              Home
            </button>
          </li>
          <li>
            <Link href="/contact" className={`hover:text-red-500 transition ${pathname === "/contact" ? "border-b-2 border-red-500" : ""}`}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/about" className={`hover:text-red-500 transition ${pathname === "/about" ? "border-b-2 border-red-500" : ""}`}>
              About
            </Link>
          </li>
          <li>
            {hydrated ? (
              session ? (
                <button onClick={handleLogOut} className="hover:text-red-500 transition hover:cursor-pointer">
                  Log Out
                </button>
              ) : (
                <Link href="/auth/signup" className="hover:text-red-500 transition hover:cursor-pointer">
                  Sign Up
                </Link>
              )
            ) : null}
          </li>
        </ul>

        {/* Icons Section */}
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-red-500 transition w-48"
            />
            <button type="submit">
              <FiSearch className="absolute right-3 top-3 text-gray-500 cursor-pointer" />
            </button>
          </form>

          {/* Wishlist Icon */}
          <button onClick={() => handleNavigation("/wishlist")}>
            <FiHeart className="text-2xl cursor-pointer text-gray-700 hover:text-red-500 transition" />
          </button>

          {/* Cart Icon */}
          <button onClick={() => handleNavigation("/cart")}>
            <FiShoppingCart className="text-2xl cursor-pointer text-gray-700 hover:text-red-500 transition" />
          </button>

          {/* User Account Icon */}
          <button onClick={() => handleNavigation("/account")}>
            <FiUser className="text-2xl cursor-pointer text-gray-700 hover:text-red-500 transition" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
