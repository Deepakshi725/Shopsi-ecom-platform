//eslint-disable-next-line
import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt, FaHome, FaBuilding, FaBriefcase, FaArrowLeft } from 'react-icons/fa';
import { server } from '../server';

// Comprehensive list of countries
const COUNTRIES_LIST = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
    'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo',
    'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
    'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
    'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
    'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
    'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort();

const CreateAddress = () => {
    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);

    const [formData, setFormData] = useState({
        country: "",
        city: "",
        address1: "",
        address2: "",
        zipCode: "",
        addressType: "Home"
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCountries, setFilteredCountries] = useState(COUNTRIES_LIST);

    useEffect(() => {
        if (!email) {
            navigate('/login');
            return;
        }
    }, [email, navigate]);

    // Filter countries based on search term
    useEffect(() => {
        const filtered = COUNTRIES_LIST.filter(country =>
            country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCountries(filtered);
    }, [searchTerm]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.address1) newErrors.address1 = "Address line 1 is required";
        if (!formData.zipCode) {
            newErrors.zipCode = "Zip code is required";
        } else if (!/^\d{5,6}$/.test(formData.zipCode)) {
            newErrors.zipCode = "Zip code must be 5-6 digits";
        }
        if (!formData.addressType) newErrors.addressType = "Address type is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post(
                `${server}/api/v2/user/add-address`,
                { ...formData, email },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (response.status === 201) {
                alert("Address added successfully!");
                navigate("/profile");
            }
        } catch (err) {
            console.error("Error adding address:", err);
            alert("Failed to add address. Please check the data and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#222831]">
            <Nav />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-[#31363F] rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-[#76ABAE]">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="text-[#EEEEEE] hover:text-[#76ABAE] transition-colors"
                            >
                                <FaArrowLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-bold text-[#EEEEEE] flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#76ABAE]" />
                                Add New Address
                            </h1>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Country */}
                        <div>
                            <label className="block text-[#EEEEEE] mb-2">Country</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg bg-[#222831] text-[#EEEEEE] border ${
                                    errors.country ? 'border-red-500' : 'border-[#76ABAE]'
                                } focus:outline-none focus:ring-2 focus:ring-[#76ABAE]`}
                                required
                            >
                                <option value="">Select a country</option>
                                {COUNTRIES_LIST.map((country, index) => (
                                    <option key={index} value={country}>{country}</option>
                                ))}
                            </select>
                            {errors.country && (
                                <p className="mt-1 text-red-500 text-sm">{errors.country}</p>
                            )}
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-[#EEEEEE] mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg bg-[#222831] text-[#EEEEEE] border ${
                                    errors.city ? 'border-red-500' : 'border-[#76ABAE]'
                                } focus:outline-none focus:ring-2 focus:ring-[#76ABAE]`}
                                placeholder="Enter city"
                                required
                            />
                            {errors.city && (
                                <p className="mt-1 text-red-500 text-sm">{errors.city}</p>
                            )}
                        </div>

                        {/* Address Line 1 */}
                        <div>
                            <label className="block text-[#EEEEEE] mb-2">Address Line 1</label>
                            <input
                                type="text"
                                name="address1"
                                value={formData.address1}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg bg-[#222831] text-[#EEEEEE] border ${
                                    errors.address1 ? 'border-red-500' : 'border-[#76ABAE]'
                                } focus:outline-none focus:ring-2 focus:ring-[#76ABAE]`}
                                placeholder="Enter street address"
                                required
                            />
                            {errors.address1 && (
                                <p className="mt-1 text-red-500 text-sm">{errors.address1}</p>
                            )}
                        </div>

                        {/* Address Line 2 */}
                        <div>
                            <label className="block text-[#EEEEEE] mb-2">Address Line 2 (Optional)</label>
                            <input
                                type="text"
                                name="address2"
                                value={formData.address2}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-[#222831] text-[#EEEEEE] border border-[#76ABAE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                placeholder="Apartment, suite, unit, etc."
                            />
                        </div>

                        {/* Zip Code */}
                        <div>
                            <label className="block text-[#EEEEEE] mb-2">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg bg-[#222831] text-[#EEEEEE] border ${
                                    errors.zipCode ? 'border-red-500' : 'border-[#76ABAE]'
                                } focus:outline-none focus:ring-2 focus:ring-[#76ABAE]`}
                                placeholder="Enter zip code"
                                required
                            />
                            {errors.zipCode && (
                                <p className="mt-1 text-red-500 text-sm">{errors.zipCode}</p>
                            )}
                        </div>

                        {/* Address Type */}
                        <div>
                            <label className="block text-[#EEEEEE] mb-2">Address Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: 'Home', icon: FaHome, label: 'Home' },
                                    { value: 'Work', icon: FaBriefcase, label: 'Work' },
                                    { value: 'Other', icon: FaBuilding, label: 'Other' }
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleChange({ target: { name: 'addressType', value: type.value } })}
                                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                                            formData.addressType === type.value
                                                ? 'bg-[#76ABAE] text-white border-[#76ABAE]'
                                                : 'bg-[#222831] text-[#EEEEEE] border-[#76ABAE] hover:bg-[#31363F]'
                                        }`}
                                    >
                                        <type.icon size={20} />
                                        <span>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.addressType && (
                                <p className="mt-1 text-red-500 text-sm">{errors.addressType}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                                loading
                                    ? 'bg-[#5b8d90] cursor-not-allowed'
                                    : 'bg-[#76ABAE] hover:bg-[#5b8d90]'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    Adding Address...
                                </div>
                            ) : (
                                'Add Address'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAddress;