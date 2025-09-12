import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { SignIn } from "@/components/auth/SignIn";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/admin/Dashboard";
import Applications from "./pages/admin/Applications";
import Users from "./pages/admin/Users";
import Certificates from "./pages/admin/Certificates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="admin-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="applications" element={<Applications />} />
                <Route path="users" element={<Users />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="courses" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Courses - Coming Soon</h1></div>} />
                <Route path="reports" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Reports - Coming Soon</h1></div>} />
                <Route path="notifications" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Notifications - Coming Soon</h1></div>} />
                <Route path="settings" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
