// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import Nav from '../components/nav';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../axiosConfig';
import { FaMapMarkerAlt, FaPlus, FaHome, FaBriefcase, FaBuilding, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { server } from '../server';
const SelectAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const navigate = useNavigate();
    const userEmail = useSelector((state) => state.user.email);

    useEffect(() => {
        if (!userEmail) {
            navigate('/login');
            return;
        }
        fetchAddresses();
    }, [userEmail, navigate]);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${server}/api/v2/user/addresses`, { params: { email: userEmail } });
            if (res.data && Array.isArray(res.data.addresses)) {
                setAddresses(res.data.addresses);
                // Set default address if available
                const defaultAddress = res.data.addresses.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress._id);
                }
            } else {
                setAddresses([]);
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAddress = (addressId) => {
        setSelectedAddress(addressId);
    };

    const handleContinue = () => {
        if (!selectedAddress) {
            alert('Please select an address to continue');
            return;
        }
        navigate('/order-confirmation', { state: { addressId: selectedAddress, email: userEmail } });
    };

    const getAddressTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'home':
                return <FaHome className="text-[#76ABAE]" />;
            case 'work':
                return <FaBriefcase className="text-[#76ABAE]" />;
            default:
                return <FaBuilding className="text-[#76ABAE]" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#222831]">
                <Nav />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#76ABAE]"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#222831]">
                <Nav />
                <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchAddresses}
                        className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-6 py-3 rounded-lg transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#222831]">
            <Nav />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-[#31363F] rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-[#76ABAE]">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-[#EEEEEE] hover:text-[#76ABAE] transition-colors"
                            >
                                <FaArrowLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-bold text-[#EEEEEE] flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#76ABAE]" />
                                Select Shipping Address
                            </h1>
                        </div>
                    </div>

                    {/* Address List */}
                    <div className="p-6">
                        {addresses.length > 0 ? (
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address._id}
                                        className={`border rounded-lg p-4 transition-all cursor-pointer ${
                                            selectedAddress === address._id
                                                ? 'border-[#76ABAE] bg-[#222831]'
                                                : 'border-[#76ABAE]/50 hover:border-[#76ABAE]'
                                        }`}
                                        onClick={() => handleSelectAddress(address._id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getAddressTypeIcon(address.addressType)}
                                                    <span className="text-[#EEEEEE] font-medium">
                                                        {address.addressType || 'Other'}
                                                    </span>
                                                    {address.isDefault && (
                                                        <span className="bg-[#76ABAE] text-white text-xs px-2 py-1 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[#EEEEEE] mb-1">
                                                    {address.address1}
                                                    {address.address2 && `, ${address.address2}`}
                                                </p>
                                                <p className="text-[#EEEEEE] mb-1">
                                                    {address.city}, {address.country}
                                                </p>
                                                <p className="text-[#EEEEEE]">{address.zipCode}</p>
                                            </div>
                                            {selectedAddress === address._id && (
                                                <div className="ml-4">
                                                    <FaCheck className="text-[#76ABAE]" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-[#EEEEEE] text-lg mb-4">No addresses found</p>
                                <button
                                    onClick={() => navigate('/create-address')}
                                    className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-6 py-3 rounded-lg transition-all flex items-center gap-2 mx-auto"
                                >
                                    <FaPlus />
                                    Add New Address
                                </button>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {addresses.length > 0 && (
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/create-address')}
                                    className="flex-1 bg-[#31363F] hover:bg-[#222831] text-[#EEEEEE] px-6 py-3 rounded-lg transition-all border border-[#76ABAE] flex items-center justify-center gap-2"
                                >
                                    <FaPlus />
                                    Add New Address
                                </button>
                                <button
                                    onClick={handleContinue}
                                    disabled={!selectedAddress}
                                    className={`flex-1 px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                        selectedAddress
                                            ? 'bg-[#76ABAE] hover:bg-[#5b8d90] text-white'
                                            : 'bg-[#5b8d90] cursor-not-allowed text-white'
                                    }`}
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectAddress;