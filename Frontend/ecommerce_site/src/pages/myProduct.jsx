//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import MyProduct from "../components/myProduct";
import { useSelector } from "react-redux";
import axios from "../axiosConfig";
import Nav from "../components/nav";

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
    
        axios.get(`/api/v2/product/my-products?email=${email}`)
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
        return <div className="text-center text-white mt-10">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }

    return (
        <>
      <Nav />
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-12 flex flex-col justify-center sm:px-6 lg:px-8">
            <h1 className="text-3xl text-center text-white py-6">My products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                {products.map((product) => (
                    <MyProduct key={product._id} {...product} />
                ))}
            </div>
        </div>
        </>
    );
}