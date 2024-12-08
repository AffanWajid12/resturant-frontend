import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrderList from './componenets/OrderList';
import Login from './componenets/Login';
import Register from './componenets/Register';
import Dashboard from './componenets/Dashboard';
import Header from './componenets/Header';
import PrivateRoute from './componenets/PrivateRoute'; // Import PrivateRoute
import MenuManagementPage from './componenets/MenuManagementPage';
import RestaurantReportsDashboard from './componenets/ResturantReportsDashboard';
import RestaurantManagement from './componenets/RestaurantManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/manage-orders"
          element={
            <PrivateRoute>
              <Header />
              <OrderList />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-items"
          element={
            <PrivateRoute>
              <Header />
              <MenuManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Header />
              <RestaurantReportsDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurants"
          element={
            <PrivateRoute>
              <Header />
              <RestaurantManagement />
            </PrivateRoute>
          }
        />

        {/* Redirect all undefined routes to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
