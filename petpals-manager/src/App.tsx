import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Pets from "./pages/Pets";
import Appointments from "./pages/Appointments";
import Services from "./pages/Services";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import AppointmentBooking from "./pages/AppointmentsBooking";
import PetDetail from "./pages/PetDetail";
import PetRegistration from "./pages/PetRegister";
import PetSetup from "./pages/PetSetup";
import ProtectedRoute from "./components/ProtectedRoute";
const queryClient = new QueryClient();

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="pt-24 pb-12 flex-grow">
      <Outlet /> {/* Đây là nơi các component con sẽ được render */}
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Trang không có Header & Footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          {/* Các trang có Header & Footer */}
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/pets/:id" element={<PetDetail />} />
                <Route path="/pets/:id/edit" element={<PetSetup/>} />
                <Route path="/pets/add" element={<PetRegistration />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/book" element={<AppointmentBooking />} />
                <Route path="/services" element={<Services />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<NotFound />} />
              </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
