import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from './OrderCard';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token) {
          setError('You must be logged in to view orders.');
          return;
        }

        // Make an API request with the token
        const response = await axios.get('http://localhost:5000/api/orders', {
          role:role,
          headers: {
            Authorization: `Bearer ${token}`, // Send token as Bearer in Authorization header
          },
        });

        setOrders(response.data); // Update the state with fetched orders
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError(error.response?.data?.message || 'Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-8">
    <div className="p-4 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-black">Manage Orders</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          !error && <p className="text-black">No orders found</p>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default OrderList;
