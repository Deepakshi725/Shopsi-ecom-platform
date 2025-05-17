// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import Product from "../components/products";
import Nav from "../components/nav";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../server";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setEmail, setAuth } from "../store/userSlice";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Home component mounted');
    console.log('Current auth state:', { isAuthenticated, email });
    
    // Check if user is authenticated
 //   const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    
  //  console.log('Local storage state:', { token: !!token, email: storedEmail });
    
    if (!storedEmail) {
      console.log('No token or email found, redirecting to login');
      navigate('/');
      return;
    }

    // Verify authentication state matches localStorage
    if (!isAuthenticated || email !== storedEmail) {
      console.log('Syncing auth state with localStorage');
      dispatch(setEmail(storedEmail));
      dispatch(setAuth(true));
    }

    const fetchProducts = async () => {
      console.log('Fetching products...');
      try {
        const response = await axios.get(`${server}/api/v2/product/get-products`);
        console.log('Products response:', response.data);
        
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error("❌ Error fetching products:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
        setError(errorMessage);
        toast.error(errorMessage);
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          console.log('Unauthorized, redirecting to login');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, email, navigate, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#76ABAE] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#EEEEEE] text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
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
        {products.length === 0 ? (
          <div className="text-center text-[#EEEEEE] text-xl">
            No products available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <Product key={product._id} {...product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
