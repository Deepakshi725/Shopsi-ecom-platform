//eslint-disable-next-line
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axiosConfig';
import Nav from '../components/nav'
import { useSelector } from 'react-redux'; // Import useSelector
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner, FaCalendarAlt, FaMapMarkerAlt, FaShoppingBag, FaMoneyBillWave } from 'react-icons/fa';
import { server } from '../server';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'processing', 'shipped', 'delivered', 'cancelled'

    // Retrieve email from Redux state
    const email = useSelector((state) => state.user.email);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return 'text-blue-500';
            case 'cancelled':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return <FaSpinner className="animate-spin" />;
            case 'cancelled':
                return <FaTimesCircle />;
            default:
                return <FaBox />;
        }
    };

    const fetchOrders = useCallback(async () => {
        if (!email) return;
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`${server}/api/v2/orders/my-orders`, {
                params: { email },
            });
            setOrders(response.data.orders);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching orders');
        } finally {
            setLoading(false);
        }
    }, [email]);

    // Cancel order handler
    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await axios.patch(`${server}/api/v2/orders/cancel-order/${orderId}`);
            
            if (response.data.message === 'Order cancelled successfully.') {
                // Show success toast
                toast.success(
                    <div className="flex flex-col">
                        <span className="font-semibold">Order Cancelled Successfully!</span>
                        <span className="text-sm opacity-90">
                            Order #{orderId.slice(-6).toUpperCase()} has been cancelled.
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

                // Update the order in local state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
                    )
                );

                // Refetch orders to ensure we have the latest data
                await fetchOrders();
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            toast.error(
                err.response?.data?.message || 'Failed to cancel order. Please try again.',
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
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // Dependency array includes email

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.orderStatus?.toLowerCase() === filter.toLowerCase();
    });

    return (
        <>
            <Nav />
            <ToastContainer />
            <div className="min-h-screen bg-[#222831] py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-center mb-10 text-[#EEEEEE]">My Orders</h1>

                    {/* Filter Buttons */}
                    <div className="flex justify-center gap-4 mb-8">
                        {['all', 'processing', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg transition-all ${
                                    filter === status
                                        ? 'bg-[#76ABAE] text-white'
                                        : 'bg-[#31363F] text-[#EEEEEE] hover:bg-[#76ABAE]/50'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <FaSpinner className="animate-spin text-[#76ABAE] text-4xl" />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {filteredOrders.length > 0 ? (
                        <div className="grid gap-8">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-[#31363F] rounded-xl shadow-lg p-6 transition-all hover:shadow-[#76ABAE]/20 border border-[#76ABAE]/50"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#76ABAE]/50 pb-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`text-2xl ${getStatusColor(order.orderStatus)}`}>
                                                {getStatusIcon(order.orderStatus)}
                                            </div>
                                            <div>
                                                <p className="text-[#EEEEEE] font-medium">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </p>
                                                <p className="text-sm text-[#76ABAE]">
                                                    <FaCalendarAlt className="inline mr-2" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:mt-0">
                                            <p className="text-2xl font-bold text-[#76ABAE]">
                                                ${order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Shipping Address */}
                                        <div className="bg-[#222831] rounded-lg p-4">
                                            <h2 className="text-lg font-semibold text-[#EEEEEE] mb-3 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-[#76ABAE]" />
                                                Shipping Address
                                            </h2>
                                            <div className="text-[#EEEEEE] space-y-1">
                                                <p>{order.shippingAddress.address1}</p>
                                                {order.shippingAddress.address2 && (
                                                    <p>{order.shippingAddress.address2}</p>
                                                )}
                                                <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                                                <p>{order.shippingAddress.country}</p>
                                                <p className="text-[#76ABAE] text-sm">
                                                    {order.shippingAddress.addressType}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="bg-[#222831] rounded-lg p-4">
                                            <h2 className="text-lg font-semibold text-[#EEEEEE] mb-3 flex items-center gap-2">
                                                <FaShoppingBag className="text-[#76ABAE]" />
                                                Order Items
                                            </h2>
                                            <div className="space-y-2">
                                                {order.orderItems.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center text-[#EEEEEE] border-b border-[#76ABAE]/20 pb-2 last:border-0"
                                                    >
                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-[#76ABAE]">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="text-[#76ABAE]">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Actions */}
                                    <div className="mt-6 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-[#EEEEEE]">
                                            <FaMoneyBillWave className="text-[#76ABAE]" />
                                            <span>Payment Status: {order.paymentStatus}</span>
                                        </div>
                                        {order.orderStatus !== 'Cancelled' && (
                                            <button
                                                onClick={() => cancelOrder(order._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center py-20">
                                <FaBox className="text-[#76ABAE] text-6xl mx-auto mb-4" />
                                <p className="text-[#EEEEEE] text-xl">
                                    {filter === 'all'
                                        ? 'No orders found.'
                                        : `No ${filter} orders found.`}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default MyOrdersPage;