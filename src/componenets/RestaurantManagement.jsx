import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus } from 'lucide-react';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state for adding/editing restaurants
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    contactNumber: '',
    email: '',
    operatingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' },
    },
    isActive: true,
  });
  // Function to handle opening the edit modal
const openEditModal = (restaurant) => {
  setSelectedRestaurant(restaurant);
  setRestaurantForm({
    name: restaurant.name || '',
    description: restaurant.description || '',
    cuisine: restaurant.cuisine || '',
    address: {
      street: restaurant.address?.street || '',
      city: restaurant.address?.city || '',
      state: restaurant.address?.state || '',
      zipCode: restaurant.address?.zipCode || '',
      country: restaurant.address?.country || '',
    },
    contactNumber: restaurant.contactNumber || '',
    email: restaurant.email || '',
    operatingHours: restaurant.operatingHours || {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' },
    },
    isActive: restaurant.isActive || true,
  });
  setIsEditModalOpen(true);
};

  // Fetch owner's restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:5000/api/restaurants/owner-restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure response.data is structured as expected
        console.log('API Response:', response);
        const restaurantData = Array.isArray(response.data)
          ? response.data
          : response.data.restaurants || [];
        setRestaurants(restaurantData);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch restaurants', error);
        setError(error.response?.data?.message || 'Failed to fetch restaurants');
        setRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setRestaurantForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // Add new restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        'http://localhost:5000/api/restaurants',
        {
          ...restaurantForm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRestaurants((prev) => [...prev, response.data]);
      setIsAddModalOpen(false);
      resetForm();
      alert('Restaurant added successfully');
    } catch (error) {
      console.error('Failed to add restaurant', error);
      alert(error.response?.data?.message || 'Failed to add restaurant');
    }
  };

  // Update existing restaurant
  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.put(
        `http://localhost:5000/api/restaurants/${selectedRestaurant._id}`,
        restaurantForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRestaurants((prev) =>
        prev.map((rest) => (rest._id === response.data._id ? response.data : rest))
      );
      setIsEditModalOpen(false);
      resetForm();
      alert('Restaurant updated successfully');
    } catch (error) {
      console.error('Failed to update restaurant', error);
      alert(error.response?.data?.message || 'Failed to update restaurant');
    }
  };
  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
  
      // Make API request to delete the restaurant
      const response = await axios.delete(`http://localhost:5000/api/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        // Update the state to remove the deleted restaurant
        setRestaurants((prevRestaurants) =>
          prevRestaurants.filter((restaurant) => restaurant._id !== restaurantId)
        );
  
        alert('Restaurant deleted successfully');
      } else {
        alert('Failed to delete restaurant');
      }
    } catch (error) {
      console.error('Failed to delete restaurant', error);
      alert(error.response?.data?.message || 'Failed to delete restaurant');
    }
  };
  
  // Reset form
  const resetForm = () => {
    setRestaurantForm({
      name: '',
      description: '',
      cuisine: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      contactNumber: '',
      email: '',
      operatingHours: {
        monday: { open: '', close: '' },
        tuesday: { open: '', close: '' },
        wednesday: { open: '', close: '' },
        thursday: { open: '', close: '' },
        friday: { open: '', close: '' },
        saturday: { open: '', close: '' },
        sunday: { open: '', close: '' },
      },
      isActive: true,
    });
  };


  return (
    <div className="min-h-screen bg-gray-100">
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">My Restaurants</h1>
      
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="bg-orange-500 text-white px-4 py-2 rounded flex items-center mb-4"
      >
        <Plus className="mr-2" /> Add New Restaurant
      </button>

      {restaurants.length === 0 ? (
        <p className="text-gray-500">You have no restaurants. Add one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-2">{restaurant.description}</p>
              <p className="text-sm">
                Cuisine: {Array.isArray(restaurant.cuisine) 
                  ? restaurant.cuisine.join(', ') 
                  : restaurant.cuisine}
              </p>
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => openEditModal(restaurant)}
                  className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => handleDeleteRestaurant(restaurant._id)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant}>
              <input
                type="text"
                name="name"
                value={restaurantForm.name}
                onChange={handleInputChange}
                placeholder="Restaurant Name"
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={restaurantForm.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                name="cuisine"
                value={restaurantForm.cuisine}
                onChange={handleInputChange}
                placeholder="Cuisine"
                className="w-full mb-2 p-2 border rounded"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  Add Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Restaurant</h2>
            <form onSubmit={handleUpdateRestaurant}>
              <input
                type="text"
                name="name"
                value={restaurantForm.name}
                onChange={handleInputChange}
                placeholder="Restaurant Name"
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={restaurantForm.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                name="cuisine"
                value={restaurantForm.cuisine}
                onChange={handleInputChange}
                placeholder="Cuisine"
                className="w-full mb-2 p-2 border rounded"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  Update Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default RestaurantManagement;