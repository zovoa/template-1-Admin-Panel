import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./components/auth/AuthProvider";
import AuthGuard from "./components/auth/AuthGuard";
import LoginForm from "./components/auth/LoginForm";
import OTPVerification from "./components/auth/OTPVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/template-1-admin-panel">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<LoginForm />} />
            <Route path="/otp" element={<OTPVerification />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </AuthGuard>
              }
            />
            <Route
              path="/products"
              element={
                <AuthGuard>
                  <Layout>
                    <Products />
                  </Layout>
                </AuthGuard>
              }
            />
            <Route
              path="/orders"
              element={
                <AuthGuard>
                  <Layout>
                    <Orders />
                  </Layout>
                </AuthGuard>
              }
            />
            <Route
              path="/payments"
              element={
                <AuthGuard>
                  <Layout>
                    <Payments />
                  </Layout>
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <Layout>
                    <Profile />
                  </Layout>
                </AuthGuard>
              }
            />

            {/* 🔁 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
