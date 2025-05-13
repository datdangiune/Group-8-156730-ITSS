
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ClinicServices from "./pages/ClinicServices";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import AppointmentDetail from "./pages/AppointmentDetail";
import MedicalRecords from "./pages/MedicalRecords";
import Services from "./pages/Services";
import Boarding from "./pages/Boarding";
import BoardingServices from "./pages/BoardingServices";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import ClininBoarding from "@/pages/ClinicBoarding"
const queryClient = new QueryClient();

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col">
              <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/appointments/:appointmentId" element={<AppointmentDetail />} />
                  <Route path="/medical-records" element={<MedicalRecords />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/clinic-services" element={<ClinicServices />} />
                  <Route path="/boarding" element={<Boarding />} />
                  <Route path="/clinic-boarding" element={<ClininBoarding />} />
                  <Route path="/boarding-services" element={<BoardingServices />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
