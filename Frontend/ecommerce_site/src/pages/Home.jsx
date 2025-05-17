// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import Product from "../components/products";
import Nav from "../components/nav";
import axios from "../axiosConfig";
import { Link } from "react-router-dom";
import {server} from "../server";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    axios
      .get(`${server}/product/get-products`)
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <p className="text-[#EEEEEE] text-xl">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <p className="text-red-400 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#222831] px-6 py-12 flex flex-col justify-center sm:px-6 lg:px-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#EEEEEE] py-6">
          Product Gallery
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <Product key={product._id} {...product} />
          ))}
        </div>
      </div>
    </>
  );
}
