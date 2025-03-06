"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      alert("Signup failed: " + response.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 bg-gray-100 flex justify-center items-center">
        <Image
          src="/auth_image.webp"
          alt="Signup Illustration"
          width={600}
          height={600}
          className="object-contain"
        />
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-96">
          <h2 className="text-2xl font-bold mb-4">Create an account</h2>
          <p className="text-gray-600 mb-6">Enter your details below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
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
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Google Signup */}
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center border border-gray-300 p-2 rounded mt-4"
          >
            <Image src="/google_icon.svg" alt="Google" width={20} height={20} className="mr-2" />
            Sign up with Google
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
