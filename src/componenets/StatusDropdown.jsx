
import React from 'react';

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
  const statuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  // Status color mapping for dropdown
  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-orange-100 text-orange-800';
      case 'Preparing': return 'bg-orange-200 text-orange-900';
      case 'Out for Delivery': return 'bg-green-100 text-green-800';
      case 'Delivered': return 'bg-green-300 text-green-800';
      case 'Cancelled': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <select
      className="mt-2 p-2 w-full border-2 border-orange-300 rounded-md focus:ring-2 focus:ring-orange-400 transition-all duration-300"
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value)}
    >
      {statuses.map((status) => (
        <option 
          key={status} 
          value={status} 
          className={`${getStatusColor(status)} font-medium`}
        >
          {status}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;