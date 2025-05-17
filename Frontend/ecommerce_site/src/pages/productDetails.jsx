//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../axiosConfig';
import Nav from "../components/nav";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaSpinner, FaExclamationCircle, FaTag, FaLayerGroup, FaInfoCircle, FaMoneyBillWave } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { server } from "../server";

export default function ProductDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);
	const [addingToCart, setAddingToCart] = useState(false);
	const email = useSelector((state) => state.user.email);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await axios.get(`${server}/api/v2/product/product/${id}`);
				setProduct(response.data.product);
			} catch (err) {
				console.error("Error fetching product:", err);
				setError(err.response?.data?.message || 'Failed to fetch product details');
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	const handleIncrement = () => {
		setQuantity((prevQuantity) => prevQuantity + 1);
	};

	const handleDecrement = () => {
		setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
	};

	const addToCart = async () => {
		if (!email) {
			toast.error('Please login to add items to cart');
			navigate('/');
			return;
		}

		setAddingToCart(true);
		try {
			const response = await axios.post(`${server}/api/v2/product/cart`, {
				userId: email,
				productId: id,
				quantity: quantity,
			});
			
			// Check if the response indicates an update or new addition
			const isUpdate = response.data.message?.includes('updated') || response.data.message?.includes('Updated');
			
			// Enhanced success toast with different messages for update vs new addition
			toast.success(
				<div className="flex flex-col">
					<span className="font-semibold">
						{isUpdate ? 'Cart Updated Successfully!' : 'Added to Cart Successfully!'}
					</span>
					<span className="text-sm opacity-90">
						{quantity} {quantity === 1 ? 'item' : 'items'} of {product.name}
					</span>
				</div>,
				{
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					style: {
						background: '#31363F',
						color: '#EEEEEE',
						borderLeft: '4px solid #76ABAE'
					}
				}
			);
			
			console.log("Cart operation:", response.data);
		} catch (err) {
			console.error("Error with cart operation:", err);
			toast.error(
				err.response?.data?.message || 'Failed to update cart',
				{
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					style: {
						background: '#31363F',
						color: '#EEEEEE',
						borderLeft: '4px solid #ff4444'
					}
				}
			);
		} finally {
			setAddingToCart(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#222831] flex justify-center items-center">
				<div className="text-center">
					<FaSpinner className="animate-spin text-[#76ABAE] text-4xl mx-auto mb-4" />
					<p className="text-[#EEEEEE] text-lg">Loading product details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#222831] flex flex-col justify-center items-center p-4">
				<FaExclamationCircle className="text-red-500 text-5xl mb-4" />
				<p className="text-red-500 text-lg mb-4 text-center">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-6 py-2 rounded-lg transition-all"
				>
					Retry
				</button>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-[#222831] flex justify-center items-center">
				<div className="text-center">
					<FaExclamationCircle className="text-[#76ABAE] text-5xl mx-auto mb-4" />
					<p className="text-[#EEEEEE] text-xl">No product found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#222831]">
			<ToastContainer />
			<Nav />
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="bg-[#31363F] rounded-xl shadow-lg overflow-hidden border border-[#76ABAE]/50">
					<div className="md:flex">
						{/* Image Section */}
						<div className="md:w-1/2 p-6">
							<div className="relative">
							{product.images && product.images.length > 0 ? (
								<img
									src={`${server}${product.images[0]}`}
									alt={product.name}
									className="w-full h-full object-cover"
								/>

								) : (
									<div className="w-full h-[400px] bg-[#222831] rounded-lg flex items-center justify-center text-[#EEEEEE]">
										No Image Available
									</div>
								)}
							</div>
						</div>

						{/* Information Section */}
						<div className="md:w-1/2 p-6">
							<h1 className="text-3xl font-bold mb-4 text-[#EEEEEE]">
								{product.name}
							</h1>

							<div className="mb-6">
								<div className="flex items-center gap-2 mb-2">
									<FaLayerGroup className="text-[#76ABAE]" />
									<h2 className="text-xl font-semibold text-[#EEEEEE]">Category</h2>
								</div>
								<p className="text-[#76ABAE]">{product.category}</p>
							</div>

							{product.tags && product.tags.length > 0 && (
								<div className="mb-6">
									<div className="flex items-center gap-2 mb-2">
										<FaTag className="text-[#76ABAE]" />
										<h2 className="text-xl font-semibold text-[#EEEEEE]">Tags</h2>
									</div>
									<div className="flex flex-wrap gap-2">
										{product.tags.map((tag, index) => (
											<span
												key={index}
												className="bg-[#76ABAE]/10 text-[#76ABAE] px-3 py-1 rounded-full text-sm"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							)}

							<div className="mb-6">
								<div className="flex items-center gap-2 mb-2">
									<FaInfoCircle className="text-[#76ABAE]" />
									<h2 className="text-xl font-semibold text-[#EEEEEE]">Description</h2>
								</div>
								<p className="text-[#EEEEEE] leading-relaxed">
									{product.description}
								</p>
							</div>

							<div className="mb-6">
								<div className="flex items-center gap-2 mb-2">
									<FaMoneyBillWave className="text-[#76ABAE]" />
									<h2 className="text-xl font-semibold text-[#EEEEEE]">Price</h2>
								</div>
								<p className="text-2xl font-bold text-[#76ABAE]">
									${product.price.toFixed(2)}
								</p>
							</div>

							<div className="mb-6">
								<div className="flex items-center gap-2 mb-2">
									<FaShoppingCart className="text-[#76ABAE]" />
									<h2 className="text-xl font-semibold text-[#EEEEEE]">Quantity</h2>
								</div>
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<button
											onClick={handleDecrement}
											className="w-10 h-10 flex items-center justify-center bg-[#222831] text-[#EEEEEE] rounded-lg hover:bg-[#76ABAE] transition-all"
										>
											<IoIosRemove />
										</button>
										<span className="w-12 text-center text-[#EEEEEE] text-lg">
											{quantity}
										</span>
										<button
											onClick={handleIncrement}
											className="w-10 h-10 flex items-center justify-center bg-[#222831] text-[#EEEEEE] rounded-lg hover:bg-[#76ABAE] transition-all"
										>
											<IoIosAdd />
										</button>
									</div>
								</div>
							</div>

							<button
								onClick={addToCart}
								disabled={addingToCart}
								className="w-full bg-[#76ABAE] hover:bg-[#5b8d90] text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{addingToCart ? (
									<>
										<FaSpinner className="animate-spin" />
										Adding to Cart...
									</>
								) : (
									<>
										<FaShoppingCart />
										Add to Cart
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}