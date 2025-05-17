//eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";

export default function Myproduct({ _id, name, images, description, price }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!images || images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [images]);

    const currentImage = images && images.length > 0 ? images[currentIndex] : null;

    const handleEdit = () => {
        navigate(`/create-product/${_id}`);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `${server}/api/v2/product/delete-product/${_id}`
            );
            if (response.status === 200) {
                alert("Product deleted successfully!");
                // Reload the page or fetch products again
                window.location.reload();
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product.");
        }
    };


    return (
        <div className="bg-[#31363F] p-4 rounded-xl shadow-lg text-[#EEEEEE] hover:shadow-xl transition duration-300 flex flex-col justify-between">
            <div className="w-full">
                {currentImage && (
                    <img
                        src={`${server}${currentImage}`}
                        alt={name}
                        className="w-full h-56 object-cover rounded-md mb-3 border-2 border-[#222831]"
                    />
                )}
                <h2 className="text-xl font-bold mb-1">{name}</h2>
                <p className="text-sm opacity-90 mb-2">{description}</p>
            </div>
            <div className="w-full mt-2">
                <p className="text-lg font-semibold text-[#76ABAE] mb-3">${price.toFixed(2)}</p>
                <button
                    className="w-full text-[#EEEEEE] bg-[#222831] hover:bg-[#76ABAE] hover:text-[#222831] px-4 py-2 rounded-md font-semibold transition duration-300"
                    onClick={handleEdit}
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="w-full text-[#EEEEEE] bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md font-semibold transition duration-300 mt-2"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

Myproduct.propTypes = {
  _id:PropTypes.string.isRequired,
  name: PropTypes.string.isRequired, // Ensure name is a required string
  images: PropTypes.arrayOf(PropTypes.string), // Ensure images is an array of strings
  description: PropTypes.string.isRequired, // Ensure description is a required string
  price: PropTypes.number.isRequired, // Ensure price is a required number
};
