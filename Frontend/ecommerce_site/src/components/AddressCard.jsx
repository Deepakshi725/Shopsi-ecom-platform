import PropTypes from "prop-types";
import { FaHome, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import axios from '../axiosConfig';
import { useState } from 'react';
import { server } from '../server';

export default function AddressCard({
	_id,
	country,
	city,
	address1,
	address2,
	zipCode,
	addressType,
	email,
	onDelete
}) {
	const [isDeleting, setIsDeleting] = useState(false);

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

	const handleDelete = async () => {
		if (!window.confirm('Are you sure you want to delete this address?')) {
			return;
		}

		setIsDeleting(true);
		try {
			await axios.delete(`${server}/user/delete-address/${_id}`, {
				params: { email }
			});
			if (onDelete) {
				onDelete(_id);
			}
		} catch (error) {
			console.error('Error deleting address:', error);
			alert('Failed to delete address. Please try again.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="bg-[#31363F] rounded-xl shadow-lg overflow-hidden border border-[#76ABAE]/50 hover:border-[#76ABAE] transition-all">
			{/* Header */}
			<div className="p-4 border-b border-[#76ABAE]/50 bg-[#222831]">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{getAddressTypeIcon(addressType)}
						<span className="text-[#EEEEEE] font-medium">
							{addressType || 'Other'}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className="text-[#EEEEEE] hover:text-red-500 transition-colors p-2"
							title="Delete Address"
						>
							<FaTrash size={16} />
						</button>
					</div>
				</div>
			</div>

			{/* Address Details */}
			<div className="p-4">
				<div className="space-y-3">
					<div className="flex items-start gap-2">
						<FaMapMarkerAlt className="text-[#76ABAE] mt-1" />
						<div>
							<p className="text-[#EEEEEE]">
								{address1}
								{address2 && `, ${address2}`}
							</p>
							<p className="text-[#EEEEEE]">
								{city}, {country}
							</p>
							<p className="text-[#EEEEEE]">{zipCode}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

AddressCard.propTypes = {
	_id: PropTypes.string.isRequired,
	country: PropTypes.string.isRequired,
	city: PropTypes.string.isRequired,
	address1: PropTypes.string.isRequired,
	address2: PropTypes.string,
	zipCode: PropTypes.string.isRequired,
	addressType: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	onDelete: PropTypes.func
};

AddressCard.defaultProps = {
	address2: '',
	onDelete: null
};


