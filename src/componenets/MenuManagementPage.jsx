import React, { useState } from 'react';
import RestaurantSelection from './RestaurantSelection';
import MenuItemsManagement from './MenuItemsManagement';

// File: src/components/MenuManagementPage.jsx
// Component: MenuManagementPage
// Purpose: Provide a wrapper component for restaurant selection and menu item management

const MenuManagementPage = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const handleRestaurantSelect = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  };

  const handleBackToSelection = () => {
    setSelectedRestaurantId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {selectedRestaurantId ? (
        <MenuItemsManagement 
          restaurantId={selectedRestaurantId}
          onBackToSelection={handleBackToSelection}
        />
      ) : (
        <RestaurantSelection onRestaurantSelect={handleRestaurantSelect} />
      )}
    </div>
  );
};

export default MenuManagementPage;