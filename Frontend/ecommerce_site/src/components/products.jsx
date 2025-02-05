//eslint-disable-next-line
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
export default function Product({ name, images, description, price }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (!images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [images]);
   
  console.log(images);
  //const currentImage = images[currentIndex];
  const currentImage = images.length > 0 ? images[currentIndex] : null;
  console.log(currentImage);
  return (
    <div className="bg-neutral-200 p-4 rounded-lg shadow-md flex flex-col justify-between">
      <div className="w-full ">
        <img
          src={`http://localhost:8000${currentImage}`} // Ensure the URL is correct\
          alt={name}
          className="w-full h-56 object-cover rounded-lg mb-2"
        />
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm opacity-75 mt-2">{description}</p>
      </div>
      <div className="w-full mt-4">
        <p className="text-lg font-bold my-2">${price.toFixed(2)}</p>
        <button className="w-full text-white px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-700 transition duration-300">
          More Info
        </button>
      </div>
    </div>
  );
}

Product.propTypes = {
  name: PropTypes.string.isRequired, // Ensure name is a required string
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure images is an array of strings
  description: PropTypes.string.isRequired, // Ensure description is a required string
  price: PropTypes.number.isRequired, // Ensure price is a required number
};