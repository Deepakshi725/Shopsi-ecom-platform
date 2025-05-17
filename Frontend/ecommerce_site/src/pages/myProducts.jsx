//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import MyProduct from "../components/myProduct";
import { useSelector } from "react-redux";
import axios from "../axiosConfig";
import Nav from "../components/nav";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { server } from "../server";

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

        // Get the email from Redux state
        const email = useSelector((state) => state.user.email);

    // useEffect(() => {

    //             // Only fetch if email is available
    //             if (!email) return;
                
    //     axios.get(`http://localhost:8000/api/v2/product/my-products?email=${email}`)
    //         .then((data) => {
    //             setProducts(data.products);
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             console.error(" Error fetching products:", err);
    //             setError(err.message);
    //             setLoading(false);
    //         });
    // }, [email]);

    useEffect(() => {
        if (!email) return alert("error in display");
    
        axios.get(`${server}/api/v2/product/my-products?email=${email}`)
            .then((res) => {
                setProducts(res.data.products);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [email]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#222831] flex items-center justify-center">
                <div className="text-[#EEEEEE] text-xl">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#222831] flex items-center justify-center">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#222831]">
            <Nav />
            <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#EEEEEE]">My Products</h1>
                        <p className="mt-2 text-[#76ABAE]">Manage your product listings</p>
                    </div>
                    
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <MyProduct key={product._id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[#EEEEEE] text-lg">No products found</p>
                            <p className="text-[#76ABAE] mt-2 mb-6">Start by adding your first product</p>
                            <Link 
                                to="/create-product" 
                                className="inline-flex items-center gap-2 bg-[#76ABAE] text-[#222831] px-6 py-3 rounded-lg font-semibold hover:bg-[#5b8d90] transition duration-300 shadow-md hover:shadow-lg"
                            >
                                <FaPlus className="text-sm" />
                                Add New Product
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}