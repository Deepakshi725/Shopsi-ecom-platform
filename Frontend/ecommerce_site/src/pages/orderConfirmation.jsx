//eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import Nav from '../components/nav';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { FaMapMarkerAlt, FaShoppingBag, FaMoneyBillWave, FaSpinner, FaExclamationCircle, FaCheckCircle, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
import { server } from '../server';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addressId, email } = location.state || {};

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        if (!addressId || !email) {
            navigate('/select-address');
            return;
        }

        const fetchData = async () => {
            try {
                const [addressResponse, cartResponse] = await Promise.all([
                    axios.get(`${server}/user/addresses`, { params: { email } }),
                    axios.get(`${server}/product/cartproducts`, { params: { email } })
                ]);

                if (addressResponse.status !== 200 || cartResponse.status !== 200) {
                    throw new Error('Failed to fetch data');
                }

                const address = addressResponse.data.addresses.find(addr => addr._id === addressId);
                if (!address) {
                    throw new Error('Selected address not found');
                }
                setSelectedAddress(address);

                const processedCartItems = cartResponse.data.cart.map(item => ({
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    images: item.productId.images.map(imagePath => `${server}${imagePath}`),
                    quantity: item.quantity,
                }));
                setCartItems(processedCartItems);

                const total = processedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                setTotalPrice(total);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [addressId, email, navigate]);

    const handlePlaceOrder = async (paymentType = 'cod', paypalOrderData = null) => {
        setIsPlacingOrder(true);
        try {
            const orderItems = cartItems.map(item => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.images?.[0] || '/default-avatar.png'
            }));

            const payload = {
                email,
                shippingAddress: selectedAddress,
                orderItems,
                paymentMethod: paymentType,
                paypalOrderData,
            };

            const response = await axios.post(`${server}/orders/place-order`, payload);
            
            // Show success toast
            toast.success(
                <div className="flex flex-col">
                    <span className="font-semibold">Order Placed Successfully!</span>
                    <span className="text-sm opacity-90">
                        Your order has been confirmed. {response.data.orders.length} item(s) ordered.
                    </span>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
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

            // Navigate after a short delay to allow the toast to be seen
            setTimeout(() => {
                navigate('/myorders');
            }, 2000);
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(
                error.response?.data?.message || 'Failed to place order. Please try again.',
                {
                    position: "top-right",
                    autoClose: 5000,
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
            setError(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#222831] flex justify-center items-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-[#76ABAE] text-4xl mx-auto mb-4" />
                    <p className="text-[#EEEEEE] text-lg">Loading order details...</p>
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

    return (
        <div className="min-h-screen bg-[#222831]">
            <Nav />
            <ToastContainer />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-[#EEEEEE]">Order Confirmation</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-[#31363F] rounded-xl p-6 border border-[#76ABAE]/50">
                            <h3 className="text-xl font-semibold mb-4 text-[#EEEEEE] flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#76ABAE]" />
                                Shipping Address
                            </h3>
                            {selectedAddress ? (
                                <div className="text-[#EEEEEE] space-y-2">
                                    <p>{selectedAddress.address1}</p>
                                    {selectedAddress.address2 && <p>{selectedAddress.address2}</p>}
                                    <p>{selectedAddress.city}, {selectedAddress.zipCode}</p>
                                    <p>{selectedAddress.country}</p>
                                    <p className="text-[#76ABAE] text-sm">
                                        {selectedAddress.addressType}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-red-500">No address selected</p>
                            )}
                        </div>

                        {/* Cart Items */}
                        <div className="bg-[#31363F] rounded-xl p-6 border border-[#76ABAE]/50">
                            <h3 className="text-xl font-semibold mb-4 text-[#EEEEEE] flex items-center gap-2">
                                <FaShoppingBag className="text-[#76ABAE]" />
                                Order Items
                            </h3>
                            {cartItems.length > 0 ? (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex items-center gap-4 p-4 bg-[#222831] rounded-lg"
                                        >
                                            <img
                                                src={item.images?.[0] || '/default-avatar.png'}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-grow">
                                                <p className="font-medium text-[#EEEEEE]">{item.name}</p>
                                                <p className="text-sm text-[#76ABAE]">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-sm text-[#76ABAE]">
                                                    Price: ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-[#76ABAE]">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-red-500">Your cart is empty</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Payment & Total */}
                    <div className="space-y-6">
                        {/* Payment Method */}
                        <div className="bg-[#31363F] rounded-xl p-6 border border-[#76ABAE]/50">
                            <h3 className="text-xl font-semibold mb-4 text-[#EEEEEE] flex items-center gap-2">
                                <FaMoneyBillWave className="text-[#76ABAE]" />
                                Payment Method
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 bg-[#222831] rounded-lg cursor-pointer hover:bg-[#2a2f38] transition-all">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="w-5 h-5 text-[#76ABAE]"
                                    />
                                    <div className="flex items-center gap-2">
                                        <FaMoneyBill className="text-[#76ABAE]" />
                                        <span className="text-[#EEEEEE]">Cash on Delivery</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-[#222831] rounded-lg cursor-pointer hover:bg-[#2a2f38] transition-all">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={paymentMethod === 'paypal'}
                                        onChange={() => setPaymentMethod('paypal')}
                                        className="w-5 h-5 text-[#76ABAE]"
                                    />
                                    <div className="flex items-center gap-2">
                                        <FaCreditCard className="text-[#76ABAE]" />
                                        <span className="text-[#EEEEEE]">Pay Online (PayPal)</span>
                                    </div>
                                </label>
                            </div>

                            {paymentMethod === 'paypal' && (
                                <div className="mt-4">
                                    <PayPalScriptProvider
                                        options={{
                                            'client-id': 'Acm9zQjTXdwA8GV0arxH3hMuavn-QPzaPsRRmSmDJJxEQhbn1WCtZ0EiGXO0pzEFJcELlq07-E602iWv',
                                        }}
                                    >
                                        <PayPalButtons
                                            style={{ layout: 'vertical' }}
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: totalPrice.toFixed(2),
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={async (data, actions) => {
                                                const order = await actions.order.capture();
                                                await handlePlaceOrder('paypal', order);
                                            }}
                                            onError={(err) => {
                                                console.error('PayPal Error:', err);
                                                setError('Payment failed. Please try again.');
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-[#31363F] rounded-xl p-6 border border-[#76ABAE]/50">
                            <h3 className="text-xl font-semibold mb-4 text-[#EEEEEE]">Order Summary</h3>
                            <div className="space-y-2 text-[#EEEEEE]">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-[#76ABAE]/50 pt-2 mt-2">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span className="text-[#76ABAE]">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {paymentMethod === 'cod' && (
                                <button
                                    onClick={() => handlePlaceOrder('cod')}
                                    disabled={isPlacingOrder}
                                    className="w-full mt-6 bg-[#76ABAE] hover:bg-[#5b8d90] text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle />
                                            Place Order
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;