"use client";

import { useEffect, useState } from 'react';
import CheckoutComponent from '../../../../components/checkoutComponent';

const CheckoutPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("checkoutProducts");
    console.log(storedProducts);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
      localStorage.removeItem("checkoutProducts");
    }
  }, []);

  return (
    <div>
      <CheckoutComponent products={products} />
    </div>
  );
};

export default CheckoutPage;
