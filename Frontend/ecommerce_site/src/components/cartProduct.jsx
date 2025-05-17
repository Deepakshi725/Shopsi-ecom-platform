//eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { FaTrash, FaSpinner } from "react-icons/fa";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import { updateCartItem, removeCartItem } from '../store/cartSlice';
import { server } from '../server';

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export default function CartProduct({ _id, name, images = [], quantity = 1, price = 0, onQuantityUpdate, onRemove }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [quantityVal, setQuantityVal] = useState(quantity);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const email = useSelector((state) => state.user.email);
	const dispatch = useDispatch();

	// Ensure price is a number
	const safePrice = typeof price === 'number' ? price : 0;
	const totalPrice = safePrice * quantityVal;

	useEffect(() => {
		let isMounted = true;
		if (!images || images.length === 0) return;
		
		const interval = setInterval(() => {
			if (isMounted) {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
			}
		}, 2000);
		
		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, [images]);

	const handleIncrement = async (e) => {
		e.preventDefault();
		const newQuantity = quantityVal + 1;
		await updateQuantity(newQuantity);
	};

	const handleDecrement = async (e) => {
		e.preventDefault();
		const newQuantity = quantityVal > 1 ? quantityVal - 1 : 1;
		await updateQuantity(newQuantity);
	};

	const updateQuantity = async (newQuantity) => {
		if (isUpdating) return;
		
		setIsUpdating(true);
		try {
			const response = await axios.put(`${server}/product/cartproduct/quantity`, {
				email,
				productId: _id,
				quantity: newQuantity,
			});
			
			if (response.data.message === 'Cart product quantity updated successfully') {
				setQuantityVal(newQuantity);
				dispatch(updateCartItem({ productId: _id, quantity: newQuantity }));
				toast.success('Cart updated successfully');
				if (onQuantityUpdate) {
					onQuantityUpdate();
				}
			} else {
				throw new Error(response.data.message || 'Failed to update quantity');
			}
		} catch (err) {
			console.error('Error updating quantity:', err);
			toast.error(err.response?.data?.message || 'Failed to update quantity');
			setQuantityVal(quantityVal);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleRemove = async (e) => {
		e.preventDefault();
		if (isRemoving) return;
		
		setIsRemoving(true);
		try {
			const response = await axios.delete(`${server}/product/cartproduct/${email}/${_id}`);
			
			if (response.data.message === 'Product removed from cart successfully') {
				dispatch(removeCartItem(_id));
				toast.success('Item removed from cart successfully');
				if (onRemove) {
					onRemove();
				}
			} else {
				throw new Error(response.data.message || 'Failed to remove item');
			}
		} catch (err) {
			console.error('Error removing item:', err);
			toast.error(err.response?.data?.message || 'Failed to remove item from cart');
		} finally {
			setIsRemoving(false);
		}
	};

	const getImageUrl = (imagePath) => {
		if (!imagePath) return PLACEHOLDER_IMAGE;
		if (imagePath.startsWith('http')) return imagePath;
		const cleanPath = imagePath.replace(/^\/+/, '');
		return `${server.replace('/api/v2', '')}/${cleanPath}`;
	};

	return (
		<div className="bg-[#31363F] rounded-xl shadow-lg overflow-hidden border border-[#76ABAE]/50 p-4 mb-4">
			<div className="flex flex-col md:flex-row gap-4">
				{/* Image Section */}
				<div className="w-full md:w-48 h-48 flex-shrink-0">
					{images && images.length > 0 ? (
						<img
							src={`http://localhost:8000${images[currentIndex]}`}
							alt={name || 'Product image'}
							className="w-full h-full object-cover rounded-lg"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = PLACEHOLDER_IMAGE;
							}}
						/>
					) : (
						<img
							src={PLACEHOLDER_IMAGE}
							alt={name || 'Product image'}
							className="w-full h-full object-cover rounded-lg"
						/>
					)}
				</div>

				{/* Product Details Section */}
				<div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-[#EEEEEE] mb-2">{name || 'Product Name'}</h3>
						<p className="text-[#76ABAE] font-bold">${totalPrice.toFixed(2)}</p>
						<p className="text-sm text-[#EEEEEE]/80">${safePrice.toFixed(2)} each</p>
					</div>

					{/* Quantity Controls */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={handleDecrement}
								disabled={isUpdating || quantityVal <= 1}
								className="w-8 h-8 flex items-center justify-center bg-[#222831] text-[#EEEEEE] rounded-lg hover:bg-[#76ABAE] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<IoIosRemove />
							</button>
							<span className="w-12 text-center text-[#EEEEEE] text-lg">
								{isUpdating ? <FaSpinner className="animate-spin mx-auto" /> : quantityVal}
							</span>
							<button
								type="button"
								onClick={handleIncrement}
								disabled={isUpdating}
								className="w-8 h-8 flex items-center justify-center bg-[#222831] text-[#EEEEEE] rounded-lg hover:bg-[#76ABAE] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<IoIosAdd />
							</button>
						</div>

						{/* Remove Button */}
						<button
							type="button"
							onClick={handleRemove}
							disabled={isRemoving}
							className="p-2 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							title="Remove from cart"
						>
							{isRemoving ? <FaSpinner className="animate-spin" /> : <FaTrash />}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

CartProduct.propTypes = {
	_id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(PropTypes.string),
	quantity: PropTypes.number.isRequired,
	price: PropTypes.number.isRequired,
	onQuantityUpdate: PropTypes.func,
	onRemove: PropTypes.func
};

CartProduct.defaultProps = {
	images: [],
	quantity: 1,
	price: 0,
	onQuantityUpdate: null,
	onRemove: null
};
