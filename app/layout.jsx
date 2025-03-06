"use client";

import localFont from "next/font/local";
import Navbar from "../components/Navbar";
import "./globals.css";
import Footer from "../components/Footer";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({children}) {
  return (
    <SessionProvider>
      <Suspense fallback={<div>Loading...</div>}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Navbar />
          <ToastContainer />
          {children}
          <Footer />
        </body>
      </html>
      </Suspense>
    </SessionProvider>
  );
}
