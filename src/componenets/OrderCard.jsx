

  import React, { useState } from 'react';
  import axios from 'axios';
import StatusDropdown from './StatusDropdown';
const apiUrl = import.meta.env.VITE_API_URL;
    const formatPKR = (amount) => {
        return new Intl.NumberFormat('en-PK', {
          style: 'currency',
          currency: 'PKR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      };
  const OrderCard = ({ order }) => {
    const [status, setStatus] = useState(order.orderStatus);
  
    const updateOrderStatus = async (newStatus) => {
        
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view orders.');
          return;
        }
        await axios.patch(
            `${apiUrl}/orders/${order._id}/status`,
            { orderStatus: newStatus }, // Data payload
            {
              headers: {
                Authorization: `Bearer ${token}`, // Pass the token in Authorization header
              },
            }
          );
        setStatus(newStatus);
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    };
  
    // Status color mapping
    const getStatusColor = (currentStatus) => {
      switch (currentStatus) {
        case 'Placed': return 'text-yellow-700';
        case 'Confirmed': return 'text-orange-600';
        case 'Preparing': return 'text-orange-500';
        case 'Out for Delivery': return 'text-green-300';
        case 'Delivered': return 'text-green-600';
        case 'Cancelled': return 'text-red-700';
        default: return 'text-gray-700';
      }
    };
  
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Order #{order._id.slice(-6)}
          </h2>
          <div className={`font-semibold ${getStatusColor(status)}`}>
            {status}
          </div>
        </div>
  
        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="font-medium text-gray-600">Customer</p>
            <p>{order.user ? order.user.username : 'Unknown User'}</p>
          </div>
  
          <div>
            <p className="font-medium text-gray-600">Restaurant</p>
            <p>{order.restaurant?.name || 'N/A'}</p>
          </div>
  
          <div>
            <p className="font-medium text-gray-600">Total Items</p>
            <p>{order.items.length}</p>
          </div>
  
          <div>
            <p className="font-medium text-gray-600">Payment Method</p>
            <p>{order.paymentMethod}</p>
          </div>
  
          <div className="col-span-2">
            <p className="font-medium text-gray-600">Special Instructions</p>
            <p>{order.specialInstructions || 'N/A'}</p>
          </div>
        </div>
  
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between">
            <p className="text-gray-600">Total Price</p>
            <p className="font-semibold">{formatPKR(order.totalPrice)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Discount</p>
            <p className="text-green-600">{formatPKR(order.discount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-bold text-gray-700">Final Total</p>
            <p className="font-bold text-primary">{formatPKR(order.finalTotal)}</p>
          </div>
        </div>
        <StatusDropdown
        currentStatus={status}
        onStatusChange={updateOrderStatus}
      />
      </div>
    );
  };    
  
  export default OrderCard;