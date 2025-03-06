"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    if (response?.ok) {
      router.push("/");
    }

    setLoading(false);

    if (response?.error) {
      alert("Login failed: " + response.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 bg-gray-100 flex justify-center items-center">
        <Image
          src="/auth_image.webp"
          alt="Login Illustration"
          width={600}
          height={600}
          className="object-contain"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-96">
          <h2 className="text-2xl font-bold">Log in to Exclusive</h2>
          <p className="text-gray-600 mb-6">Enter your details below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email or Phone Number"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Sign in with Google */}
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center border border-gray-300 p-2 rounded mt-4"
          >
            <Image src="/google_icon.svg" alt="Google" width={20} height={20} className="mr-2" />
            Sign in with Google
          </button>

          {/* Forgot Password */}
          <div className="flex justify-between mt-2 text-sm">
            <span></span>
            <a href="/reset-password" className="text-red-500">
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}