import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, ImagePlus, X } from 'lucide-react';

// File: src/components/MenuItemsManagement.jsx
// Component: MenuItemsManagement
// Purpose: Manage menu items for a specific restaurant (CRUD operations)

const MenuItemsManagement = ({ restaurantId, onBackToSelection }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false
    },
    images: [],
    isAvailable: true,
    preparationTime: '',
    customizations: []
  });

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/${restaurantId}/menu-items`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMenuItems(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch menu items');
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested dietaryInfo
    if (name.startsWith('dietaryInfo.')) {
      const dietaryInfoKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dietaryInfo: {
          ...prev.dietaryInfo,
          [dietaryInfoKey]: type === 'checkbox' ? checked : value
        }
      }));
      return;
    }

    // Handle other inputs
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  // Remove image
  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add customization
  const addCustomization = () => {
    setFormData(prev => ({
      ...prev,
      customizations: [
        ...prev.customizations, 
        { name: '', options: [''], required: false }
      ]
    }));
  };

  // Update customization
  const updateCustomization = (index, field, value) => {
    const updatedCustomizations = [...formData.customizations];
    updatedCustomizations[index] = {
      ...updatedCustomizations[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      customizations: updatedCustomizations
    }));
  };

  // Remove customization
  const removeCustomization = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Open modal for adding new menu item
  const handleAddMenuItem = () => {
    setModalMode('add');
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false
      },
      images: [],
      isAvailable: true,
      preparationTime: '',
      customizations: []
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing menu item
  const handleEditMenuItem = (item) => {
    setModalMode('edit');
    setSelectedMenuItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      category: item.category,
      dietaryInfo: { ...item.dietaryInfo },
      images: item.images || [],
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime?.toString() || '',
      customizations: item.customizations || []
    });
    setIsModalOpen(true);
  };

  // Submit form for adding or editing menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Prepare form data for submission
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined
      };
      
      if (modalMode === 'add') {
        // Add new menu item
        const response = await axios.post(`http://localhost:5000/api/${restaurantId}/menu-items`, 
          submissionData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setMenuItems([...menuItems, response.data]);
      } else {
        // Update existing menu item
        const response = await axios.put(`http://localhost:5000/api/menu-items/${selectedMenuItem._id}`, 
          submissionData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update the menu items list
        setMenuItems(menuItems.map(item => 
          item._id === selectedMenuItem._id ? response.data : item
        ));
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false
        },
        images: [],
        isAvailable: true,
        preparationTime: '',
        customizations: []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/menu-items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Remove the deleted item from the list
        setMenuItems(menuItems.filter(item => item._id !== itemId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete menu item');
      }
    }
  };

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading menu items...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBackToSelection} 
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          &larr; Back to Restaurants
        </button>
        <h2 className="text-2xl font-bold">Menu Items Management</h2>
        <button 
          onClick={handleAddMenuItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Plus className="mr-2" size={20} /> Add Menu Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input 
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg pl-10"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      {/* Menu Items Grid */}
      {filteredMenuItems.length === 0 ? (
        <div className="text-center text-gray-600">
          No menu items found. Add your first menu item!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <div 
              key={item._id} 
              className="bg-white shadow-md rounded-lg p-6 relative"
            >
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => handleEditMenuItem(item)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => handleDeleteMenuItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 font-bold">{item.price.toFixed(2)} PKR</span>
                <span className="text-gray-500 text-sm">{item.category}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {item.dietaryInfo.isVegetarian && <span className="bg-green-100 px-2 rounded">Vegetarian</span>}
                {item.dietaryInfo.isVegan && <span className="bg-green-200 px-2 rounded">Vegan</span>}
                {item.dietaryInfo.isGlutenFree && <span className="bg-yellow-100 px-2 rounded">Gluten-Free</span>}
                {item.dietaryInfo.isSpicy && <span className="bg-red-100 px-2 rounded">Spicy</span>}
              </div>
              {item.preparationTime && (
                <div className="text-sm text-gray-500 mt-2">
                  Prep Time: {item.preparationTime} mins
                </div>
              )}
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  {item.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Adding/Editing Menu Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
        <div className="mt-[50vh] bg-white p-8 rounded-lg w-full max-w-2xl my-8 transform translate-y-0">
            <h2 className="text-2xl font-bold mb-6">
              {modalMode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    maxLength={100}
                    minLength={2}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Category</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Sides">Sides</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    className="w-full px-3 py-2 border rounded-lg"
                  ></textarea>                </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Preparation Time (mins)</label>
                    <input
                      type="number"
                      name="preparationTime"
                      min="0"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Available</label>
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <div className="mt-2 flex space-x-2 flex-wrap">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative w-16 h-16">
                          <img
                            src={image}
                            alt="Menu Item"
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Dietary Information</label>
                    <div className="flex space-x-4">
                      <label>
                        <input
                          type="checkbox"
                          name="dietaryInfo.isVegetarian"
                          checked={formData.dietaryInfo.isVegetarian}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Vegetarian
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="dietaryInfo.isVegan"
                          checked={formData.dietaryInfo.isVegan}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Vegan
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="dietaryInfo.isGlutenFree"
                          checked={formData.dietaryInfo.isGlutenFree}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Gluten-Free
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="dietaryInfo.isSpicy"
                          checked={formData.dietaryInfo.isSpicy}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Spicy
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Customizations</label>
                    <button
                      type="button"
                      onClick={addCustomization}
                      className="bg-blue-500 text-white px-2 py-1 rounded mb-2"
                    >
                      Add Customization
                    </button>
                    {formData.customizations.map((customization, index) => (
                      <div key={index} className="mb-4 border p-4 rounded">
                        <div className="flex justify-between items-center">
                          <label className="block text-gray-700 mb-2">Name</label>
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => removeCustomization(index)}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={customization.name}
                          onChange={(e) =>
                            updateCustomization(index, 'name', e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg mb-2"
                        />
                        <label className="block text-gray-700 mb-2">Options (Comma Separated)</label>
                        <input
                          type="text"
                          value={customization.options.join(',')}
                          onChange={(e) =>
                            updateCustomization(
                              index,
                              'options',
                              e.target.value.split(',')
                            )
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <label className="block text-gray-700 mt-2">
                          <input
                            type="checkbox"
                            checked={customization.required}
                            onChange={(e) =>
                              updateCustomization(index, 'required', e.target.checked)
                            }
                            className="mr-2"
                          />
                          Required
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default MenuItemsManagement;
  