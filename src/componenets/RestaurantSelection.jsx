import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, ArrowRight } from 'lucide-react';

// File: src/components/RestaurantSelection.jsx
// Component: RestaurantSelection
// Purpose: Allow restaurant owners to select their restaurant before managing menu items

const RestaurantSelection = ({ onRestaurantSelect }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch restaurants owned by the logged-in user
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/restaurants/owner-restaurants', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRestaurants(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurants');
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading your restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">No restaurants found. Please create a restaurant first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Your Restaurant</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div 
            key={restaurant._id} 
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => onRestaurantSelect(restaurant._id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Building2 className="text-blue-500" size={40} />
                <div>
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                </div>
              </div>
              <ArrowRight className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantSelection;