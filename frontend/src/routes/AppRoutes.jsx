import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { PageLoader } from '../components/ui/Loaders';

// Layouts
const MainLayout = lazy(() => import('../layouts/PublicLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const DealerLayout = lazy(() => import('../layouts/DealerLayout'));
const UserLayout = lazy(() => import('../layouts/UserLayout'));

// Public Pages
const Home = lazy(() => import('../pages/Home'));
const Cars = lazy(() => import('../pages/Cars'));
const SingleCar = lazy(() => import('../pages/SingleCar'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Compare = lazy(() => import('../pages/Compare'));
const UserLogin = lazy(() => import('../pages/UserLogin'));
const UserSignup = lazy(() => import('../pages/UserSignup'));
const DealerLogin = lazy(() => import('../pages/DealerLogin'));
const DealerSignup = lazy(() => import('../pages/DealerSignup'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ManageDealers = lazy(() => import('../pages/admin/ManageDealers'));
const ManageCategories = lazy(() => import('../pages/admin/ManageCategories'));
const ViewBookings = lazy(() => import('../pages/admin/ViewBookings'));

// Dealer Pages
const DealerDashboard = lazy(() => import('../pages/dealer/DealerDashboard'));
const DealerManageCars = lazy(() => import('../pages/dealer/DealerManageCars'));
const DealerCarRequests = lazy(() => import('../pages/dealer/DealerCarRequests'));
const DealerProfile = lazy(() => import('../pages/dealer/DealerProfile'));
const DealerEditCar = lazy(() => import('../pages/dealer/DealerEditCar'));

// User Pages
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const UserMyCars = lazy(() => import('../pages/user/UserMyCars'));
const UserProfile = lazy(() => import('../pages/user/UserProfile'));
const BookingSuccess = lazy(() => import('../pages/user/BookingSuccess'));

// Common
const ChangePassword = lazy(() => import('../pages/common/ChangePassword'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/single_car/:id" element={<SingleCar />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Auth Routes (No Header/Footer) */}
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/signup" element={<UserSignup />} />
                <Route path="/dealer/login" element={<DealerLogin />} />
                <Route path="/dealer/signup" element={<DealerSignup />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="manage_dealers" element={<ManageDealers />} />
                    <Route path="manage_categories" element={<ManageCategories />} />
                    <Route path="view_bookings" element={<ViewBookings />} />
                    <Route path="change_password" element={<ChangePassword />} />
                </Route>

                {/* Dealer Routes */}
                <Route path="/dealer" element={<ProtectedRoute allowedRoles={['dealer']}><DealerLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<DealerDashboard />} />
                    <Route path="manage_cars" element={<DealerManageCars />} />
                    <Route path="car_req" element={<DealerCarRequests />} />
                    <Route path="view_approved_req" element={<DealerCarRequests />} />
                    <Route path="view_completed_req" element={<DealerCarRequests />} />
                    <Route path="view_cancelled_req" element={<DealerCarRequests />} />
                    <Route path="profile" element={<DealerProfile />} />
                    <Route path="edit_car/:id" element={<DealerEditCar />} />
                    <Route path="change_password" element={<ChangePassword />} />
                </Route>

                {/* User Routes */}
                <Route path="/user" element={<ProtectedRoute allowedRoles={['user']}><UserLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="mycars" element={<UserMyCars />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="booking_success" element={<BookingSuccess />} />
                    <Route path="change_password" element={<ChangePassword />} />
                </Route>

                {/* Redirects */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/dealer" element={<Navigate to="/dealer/dashboard" replace />} />
                <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
