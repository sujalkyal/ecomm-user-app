"use client";

import localFont from "next/font/local";
import Navbar from "../components/Navbar";
import "./globals.css";
import Footer from "../components/Footer";
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
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Navbar />
          <ToastContainer />
          {children}
          <Footer />
        </body>
      </html>
    </SessionProvider>
  );
}
