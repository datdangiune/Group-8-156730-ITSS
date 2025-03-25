
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <FileSearch className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-6">
        Oops! The page you're looking for cannot be found.
      </p>
      <Button onClick={() => navigate("/")} size="lg">
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
