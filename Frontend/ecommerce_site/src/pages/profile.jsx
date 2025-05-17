//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import AddressCard from "../components/AddressCard";
import Nav from "../components/nav";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../axiosConfig";
import { FaUser, FaEdit, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { server } from "../server.js";

export default function Profile() {
	const email = useSelector((state) => state.user.email);
	const [personalDetails, setPersonalDetails] = useState({
		name: "",
		email: "",
		phoneNumber: "",
		avatarUrl: "",
	});
	const [addresses, setAddresses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editedDetails, setEditedDetails] = useState({});
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!email) {
			navigate('/');
			return;
		}

		setLoading(true);
		axios.get(`${server}/api/v2/user/profile?email=${email}`)
			.then((res) => {
				console.log("Profile response:", res.data);
				const data = res.data;
				setPersonalDetails(data.user);
				setEditedDetails(data.user);
				setAddresses(data.addresses);
				
				if (data.user.avatarUrl) {
					console.log("Avatar URL from server:", data.user.avatarUrl);
					const cleanUrl = data.user.avatarUrl.replace(/\\/g, '/');
					const avatarUrl = cleanUrl.startsWith('http') 
						? cleanUrl 
						: `${server}${cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl}`;
					console.log("Constructed avatar URL:", avatarUrl);
					setPreviewUrl(avatarUrl);
				} else {
					setPreviewUrl("https://cdn.vectorstock.com/i/500p/17/61/male-avatar-profile-picture-vector-10211761.jpg");
				}
			})
			.catch((err) => {
				console.error("API error:", err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [email, navigate]);

	const handleAddAddress = () => {
		navigate("/create-address");
	};

	const handleEditClick = () => {
		setIsEditing(true);
		setEditedDetails(personalDetails);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedDetails(personalDetails);
		setSelectedFile(null);
		setPreviewUrl(personalDetails.avatarUrl ? (personalDetails.avatarUrl.startsWith('http') ? personalDetails.avatarUrl : `${server}${personalDetails.avatarUrl}`) : "");
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleSaveChanges = async () => {
		try {
			const formData = new FormData();
			formData.append("name", editedDetails.name);
			formData.append("phoneNumber", editedDetails.phoneNumber);
			if (selectedFile) {
				formData.append("file", selectedFile);
			}

			const response = await axios.put(
				`${server}/api/v2/user/update-profile?email=${email}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.data.success) {
				console.log("Update response:", response.data);
				const updatedUser = response.data.user;
				setPersonalDetails(updatedUser);
				const cleanUrl = updatedUser.avatarUrl.replace(/\\/g, '/');
				const newAvatarUrl = cleanUrl.startsWith('http')
					? cleanUrl
					: `${server}${cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl}`;
				console.log("New avatar URL:", newAvatarUrl);
				setPreviewUrl(newAvatarUrl);
				setIsEditing(false);
				setSelectedFile(null);
				alert("Profile updated successfully!");
			} else {
				throw new Error("Failed to update profile");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			alert("Failed to update profile. Please try again.");
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

	return (
		<div className="min-h-screen bg-[#222831]">
			<Nav />
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="bg-[#31363F] rounded-xl shadow-lg overflow-hidden">
					{/* Profile Header */}
					<div className="p-8 border-b border-[#76ABAE]">
						<div className="flex flex-col md:flex-row items-center gap-8">
							{/* Profile Picture */}
							<div className="relative group">
								<div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#76ABAE]">
									<img
										src={previewUrl || "https://cdn.vectorstock.com/i/500p/17/61/male-avatar-profile-picture-vector-10211761.jpg"}
										alt="profile"
										className="w-full h-full object-cover"
										onError={(e) => {
											console.error("Image load error:", e);
											console.error("Failed image URL:", e.target.src);
											console.error("Current preview URL:", previewUrl);
											fetch(e.target.src)
												.then(response => {
													if (!response.ok) {
														console.error("Image fetch failed with status:", response.status);
													}
												})
												.catch(error => {
													console.error("Image fetch error:", error);
												});
											e.target.onerror = null;
											e.target.src = "https://cdn.vectorstock.com/i/500p/17/61/male-avatar-profile-picture-vector-10211761.jpg";
										}}
									/>
								</div>
								{isEditing && (
									<label className="absolute bottom-0 right-0 bg-[#76ABAE] p-2 rounded-full cursor-pointer hover:bg-[#5b8d90] transition-all">
										<FaEdit className="text-white" />
										<input
											type="file"
											accept="image/*"
											onChange={handleFileChange}
											className="hidden"
										/>
									</label>
								)}
							</div>

							{/* Profile Info */}
							<div className="flex-1">
								<div className="flex justify-between items-start mb-4">
									<h1 className="text-3xl font-bold text-[#EEEEEE]">
										{isEditing ? (
											<input
												type="text"
												value={editedDetails.name}
												onChange={(e) => setEditedDetails({...editedDetails, name: e.target.value})}
												className="bg-[#222831] text-[#EEEEEE] p-2 rounded-lg border border-[#76ABAE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
											/>
										) : (
											personalDetails.name
										)}
									</h1>
									{!isEditing ? (
										<button
											onClick={handleEditClick}
											className="flex items-center gap-2 bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-4 py-2 rounded-lg transition-all"
										>
											<FaEdit />
											Edit Profile
										</button>
									) : (
										<div className="flex gap-2">
											<button
												onClick={handleSaveChanges}
												className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-4 py-2 rounded-lg transition-all"
											>
												Save Changes
											</button>
											<button
												onClick={handleCancelEdit}
												className="bg-[#31363F] hover:bg-[#222831] text-[#EEEEEE] px-4 py-2 rounded-lg transition-all border border-[#76ABAE]"
											>
												Cancel
											</button>
										</div>
									)}
								</div>

								<div className="space-y-4">
									<div className="flex items-center gap-3 text-[#EEEEEE]">
										<FaEnvelope className="text-[#76ABAE]" />
										<span>{personalDetails.email}</span>
									</div>
									<div className="flex items-center gap-3 text-[#EEEEEE]">
										<FaPhone className="text-[#76ABAE]" />
										{isEditing ? (
											<input
												type="tel"
												value={editedDetails.phoneNumber}
												onChange={(e) => setEditedDetails({...editedDetails, phoneNumber: e.target.value})}
												className="bg-[#222831] text-[#EEEEEE] p-2 rounded-lg border border-[#76ABAE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
												placeholder="Enter phone number"
											/>
										) : (
											<span>{personalDetails.phoneNumber || "Not provided"}</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Addresses Section */}
					<div className="p-8">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-[#EEEEEE] flex items-center gap-2">
								<FaMapMarkerAlt className="text-[#76ABAE]" />
								My Addresses
							</h2>
							<button
								onClick={handleAddAddress}
								className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
							>
								<FaEdit />
								Add New Address
							</button>
						</div>

						{addresses.length === 0 ? (
							<div className="text-center py-8">
								<p className="text-[#EEEEEE] text-lg mb-4">No addresses found</p>
								<button
									onClick={handleAddAddress}
									className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-6 py-3 rounded-lg transition-all"
								>
									Add Your First Address
								</button>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{addresses.map((address, index) => (
									<AddressCard key={index} {...address} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}