"use client";

import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`);
        setFetchedUser(response.data);
        setUserDetails((prev) => ({ ...prev, ...response.data }));
      } catch (error) {
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleInputChange = (field) => (e) => {
    setUserDetails((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveFunction = async () => {
    const { currentPassword, newPassword, confirmPassword, ...otherDetails } = userDetails;

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    try {
      const authResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/checkPassword`, { currentPassword });
      if (!authResponse.data.valid) {
        toast.error("Incorrect password entered");
        return;
      }

      const updatedDetails = newPassword ? { ...otherDetails, newPassword } : otherDetails;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/updateDetails`, updatedDetails);

      if (response.data.success) {
        toast.success("Changes Saved");
        setFetchedUser(response.data.updatedUser);
        setUserDetails((prev) => ({ ...prev, ...response.data.updatedUser }));
      } else {
        toast.error("Error Saving Changes");
      }
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const cancelFunction = () => {
    toast.success("Form cleared");
    setUserDetails({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <main className="flex flex-grow justify-center py-10 bg-gray-100">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage My Account</h2>
          <div className="flex">
            <div className="w-1/4 border-r pr-4">
              <nav className="space-y-3">
                <Link href="/account/profile">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-red-500 text-white hover:cursor-pointer">My Profile</button>
                </Link>
                <Link href="/account/orders">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer">My Orders</button>
                </Link>
                <Link href="/wishlist">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer">My Wishlist</button>
                </Link>
              </nav>
            </div>
            <div className="w-3/4 pl-6">
              <h3 className="text-lg font-semibold text-red-500 mb-4">Edit Your Profile</h3>

              {/* Show loading indicator */}
              {loading ? (
                <div className="text-center text-gray-600">Loading user details...</div>
              ) : (
                <>
                  {/* Display fetched user details */}
                  {fetchedUser && (
                    <div className="bg-gray-50 border p-4 rounded-lg mb-6">
                      <h4 className="text-md font-semibold mb-2">Your Profile Information</h4>
                      <p><strong>First Name:</strong> {fetchedUser.firstName}</p>
                      <p><strong>Last Name:</strong> {fetchedUser.lastName}</p>
                      <p><strong>Email:</strong> {fetchedUser.email}</p>
                      <p><strong>Address:</strong> {fetchedUser.address || "Not provided"}</p>
                    </div>
                  )}

                  {/* Form to edit profile */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium">First Name</label>
                        <input type="text" className="w-full p-2 border rounded" value={userDetails.firstName} onChange={handleInputChange("firstName")} />
                      </div>
                      <div>
                        <label className="block font-medium">Last Name</label>
                        <input type="text" className="w-full p-2 border rounded" value={userDetails.lastName} onChange={handleInputChange("lastName")} />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium">Email</label>
                      <input type="email" className="w-full p-2 border rounded" value={userDetails.email} onChange={handleInputChange("email")} />
                    </div>
                    <div>
                      <label className="block font-medium">Address</label>
                      <input type="text" className="w-full p-2 border rounded" value={userDetails.address || ""} onChange={handleInputChange("address")} />
                    </div>

                    <h4 className="text-md font-semibold mt-6">Password Changes</h4>
                    <div>
                      <label className="block font-medium">Current Password</label>
                      <input type="password" className="w-full p-2 border rounded" value={userDetails.currentPassword} onChange={handleInputChange("currentPassword")} />
                    </div>
                    <div>
                      <label className="block font-medium">New Password</label>
                      <input type="password" className="w-full p-2 border rounded" value={userDetails.newPassword} onChange={handleInputChange("newPassword")} />
                    </div>
                    <div>
                      <label className="block font-medium">Confirm New Password</label>
                      <input type="password" className="w-full p-2 border rounded" value={userDetails.confirmPassword} onChange={handleInputChange("confirmPassword")} />
                    </div>
                    <div className="flex justify-between mt-4">
                      <button type="button" className="text-gray-600" onClick={cancelFunction}>Cancel</button>
                      <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={saveFunction}>Save Changes</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
