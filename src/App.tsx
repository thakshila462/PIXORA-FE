import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectRoute";

import { AdminLayout } from "./layout/AdminLayout";
import { CustomerLayout } from "./layout/CustomerLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/register";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import AdminDashboard from "./pages/AdminDashboard";
import Editor from "./pages/Editor";
// import Packages from "./pages/Packages";
import CustomerDetails from "./pages/CustomerDetails";
import ManagePackages from "./pages/ManagePackages";
import ShootRequests from "./pages/shootRequest";

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "PHOTOGRAPHER"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />
        </Route>

        <Route
          path="/manage-packages"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManagePackages />
            </ProtectedRoute>
          }
        />


        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CustomerDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shoot-request"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ShootRequests />
            </ProtectedRoute>
          }
        />


        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />

          {/* <Route
            path="booking"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
                <Booking />
              </ProtectedRoute>
            }
          /> */}

          <Route path="booking" element={<Booking />} />
          <Route path="payment" element={<Payment />} />

          {/* <Route
            path="payment"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
                <Payment />
              </ProtectedRoute>
            }
          /> */}
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />


        <Route path="editor" element={<Editor />} />
        {/* <Route path="packages" element={<Packages />} /> */}
        <Route path="customer-details" element={<CustomerDetails />} />
        <Route path="manage-packages" element={<ManagePackages />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;