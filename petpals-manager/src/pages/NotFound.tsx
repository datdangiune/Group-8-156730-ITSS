
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 animate-fade-in">
      <div className="glass-card dark:glass-card-dark rounded-2xl p-10 max-w-md w-full">
        <div className="mb-6 text-primary">
          <PawPrint className="h-16 w-16 mx-auto animate-pulse-soft" />
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Oops! Looks like this page has run away.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
