import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart, 
  Settings, 
  CreditCard ,CopyPlus
} from 'lucide-react';
import Header from './Header';

const DashboardCard = ({ icon: Icon, title, description, to }) => (
  <Link 
    to={to} 
    className="
      bg-white 
      rounded-lg 
      shadow-md 
      p-6 
      hover:shadow-xl 
      transition-all 
      duration-300 
      transform 
      hover:-translate-y-2 
      border 
      border-gray-100 
      flex 
      flex-col 
      items-start
    "
  >
    <div className="
      mb-4 
      bg-blue-50 
      text-blue-600 
      p-3 
      rounded-full
    ">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </Link>
);

const Dashboard = () => {
  const dashboardItems = [
    {
      icon: ShoppingCart,
      title: 'Manage Orders',
      description: 'View and manage all your orders',
      to: '/manage-orders'
    },
    {
      icon: Package,
      title: 'Menu Items',
      description: 'Manage your menu items inventory',
      to: '/manage-items'
    },
    {
      icon: BarChart,
      title: 'Analytics',
      description: 'Get insights into your business performance',
      to: '/analytics'
    },
    {
      icon: CopyPlus, // Replace with actual icon or import
      title: 'Manage Restaurants',
      description: 'View and manage your restaurant details',
      to: '/restaurants' // New path for managing restaurants
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <DashboardCard 
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              to={item.to}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;