//eslint-disable-next-line
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Product({ _id, name, images, description, price }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

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
        <p className="text-lg font-semibold text-[#76ABAE] mb-3">
          ${price.toFixed(2)}
        </p>
        <button
          className="w-full text-[#EEEEEE] bg-[#222831] hover:bg-[#76ABAE] hover:text-[#222831] px-4 py-2 rounded-md font-semibold transition duration-300"
          onClick={() => navigate(`/product/${_id}`)}
        >
          More Info
        </button>
      </div>
    </div>
  );
}

Product.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};
