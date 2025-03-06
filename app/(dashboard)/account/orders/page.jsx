"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const PLATFORM_FEE = 20; // Added platform fee constant

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getAllOrders`);
        
        // Fetch all products
        const productsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/getAllProducts`);
        
        setOrders(ordersResponse.data);
        setFilteredOrders(ordersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    filterOrdersByMonth(selectedMonth);
  }, [selectedMonth, orders]);

  const filterOrdersByMonth = (month) => {
    if (month === "all") {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === parseInt(month);
    });

    setFilteredOrders(filtered);
  };

  const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };

  const findProductDetails = (productId) => {
    return products.find(product => product.id === productId) || null;
  };

  // Calculate the order total from product details
  const calculateOrderTotal = (orderProducts) => {
    if (!orderProducts || !Array.isArray(orderProducts)) return 0;
    
    return orderProducts.reduce((total, orderProduct) => {
      const product = findProductDetails(orderProduct.productId);
      if (!product) return total;
      
      const itemTotal = product.price * (orderProduct.quantity || 1);
      return total + itemTotal;
    }, 0);
  };

  // Calculate the final total with platform fee
  const calculateFinalTotal = (orderProducts) => {
    const subtotal = calculateOrderTotal(orderProducts);
    return subtotal + PLATFORM_FEE;
  };

  const generateInvoice = (order) => {
    try {
      if (!order || !order.id) {
        throw new Error("Invalid order data");
      }
  
      const doc = new jsPDF();
  
      // Header Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("KHARID LO", 105, 20, { align: "center" });
  
      doc.setFontSize(14);
      doc.text("Luxury Brand", 105, 30, { align: "center" });
      doc.text("www.kharidlo.com", 105, 40, { align: "center" });
  
      doc.setLineWidth(0.5);
      doc.line(10, 50, 200, 50);
  
      // Invoice & Customer Details
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: ${order.id}`, 10, 60);
      doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}`, 10, 70);
  
      doc.text("Bill To:", 10, 85);
      doc.setFont("helvetica", "bold");
      doc.text(`${order.name || "N/A"}`, 10, 95);
      doc.setFont("helvetica", "normal");
      doc.text(`${order.address || "N/A"}`, 10, 105);
      doc.text(`Phone: ${order.phone || "N/A"}`, 10, 115);
  
      doc.line(10, 125, 200, 125); // Line before product table
  
      // Check if order.products is valid
      if (!order.products || !Array.isArray(order.products) || order.products.length === 0) {
        doc.text("No products available in this order.", 10, 140);
      } else {
        // Table for Products
        const tableColumn = ["Product Name", "Qty", "Price", "Total"];
        const tableRows = order.products.map((orderProduct) => {
          const product = findProductDetails(orderProduct.productId);
          const productName = product ? product.name : "Unknown Product";
          const price = product ? product.price : 0;
          const quantity = orderProduct.quantity || 0;
          const totalPrice = price * quantity;
          
          return [
            productName,
            quantity.toString(),
            `$${price}`,
            `$${totalPrice}`,
          ];
        });
  
        autoTable(doc, {
          startY: 130,
          head: [tableColumn],
          body: tableRows,
          theme: "grid",
          styles: { fontSize: 10, halign: "center" },
          headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        });
      }
  
      // Calculate subtotal and add platform fee
      const calculatedSubtotal = calculateOrderTotal(order.products);
      const finalTotal = calculatedSubtotal + PLATFORM_FEE;
      
      // Footer - Total Amount with Platform Fee
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 150;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Subtotal: $${calculatedSubtotal}`, 10, finalY);
      doc.text(`Platform Fee: $${PLATFORM_FEE}`, 10, finalY + 10);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Total Amount: $${finalTotal}`, 10, finalY + 20);
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.text("Thank you for shopping with us!", 10, finalY + 30);
  
      // Save PDF
      doc.save(`Invoice_Order_${order.id}.pdf`);
    } catch (error) {
      console.error("Failed to generate invoice", error);
      toast.error("Failed to generate invoice. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <main className="flex flex-grow justify-center py-10 bg-gray-100">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">My Orders</h2>
          <div className="flex">
            <div className="w-1/4 border-r pr-4">
              <nav className="space-y-3">
                <Link href="/account">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer">
                    My Profile
                  </button>
                </Link>
                <Link href="/account/orders">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-red-500 text-white hover:cursor-pointer">
                    My Orders
                  </button>
                </Link>
                <Link href="/wishlist">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer">
                    My Wishlist
                  </button>
                </Link>
              </nav>
            </div>
            <div className="w-3/4 pl-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-red-500">Your Orders</h3>
                
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Orders</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {getMonthName(i)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <p className="text-gray-500">
                  {selectedMonth === "all" 
                    ? "You have no orders yet." 
                    : `No orders found for ${getMonthName(parseInt(selectedMonth))}.`}
                </p>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    // Calculate order subtotal from products
                    const calculatedSubtotal = calculateOrderTotal(order.products);
                    // Calculate final total with platform fee
                    const finalTotal = calculatedSubtotal + PLATFORM_FEE;
                    
                    return (
                      <div key={order.id} className="bg-gray-50 border p-4 rounded-lg">
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Address:</strong> {order.address}, {order.phone}</p>
                        <p><strong>Subtotal:</strong> ${calculatedSubtotal}</p>
                        <p><strong>Platform Fee:</strong> ${PLATFORM_FEE}</p>
                        <p><strong>Total Amount:</strong> ${finalTotal}</p>
                        <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
                        <p>
                          <strong>Status:</strong>
                          <span className={`font-semibold ${order.status === "pending" ? "text-red-500" : "text-green-500"}`}>
                            {order.status}
                          </span>
                        </p>                      
                        <h4 className="text-md font-semibold mt-4">Items:</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {order.products?.map((orderProduct, index) => {
                            const product = findProductDetails(orderProduct.productId);
                            return (
                              <li key={index}>
                                <strong>Product:</strong> {product ? product.name : "Unknown Product"} | 
                                <strong> Qty:</strong> {orderProduct.quantity} | 
                                <strong> Price:</strong> ${product ? product.price : "0"}
                              </li>
                            );
                          })}
                        </ul>
                        {order.status === "completed" && (
                          <button
                            onClick={() => generateInvoice(order)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer block"
                          >
                            Download Invoice
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}