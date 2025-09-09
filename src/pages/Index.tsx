import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, BarChart3, Users, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/admin-hero.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Auto-redirect based on auth status
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate("/admin");
        } else {
          navigate("/signin");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [navigate, isAuthenticated, isLoading]);

  const features = [
    {
      icon: BarChart3,
      title: "Dashboard Analytics",
      description: "Comprehensive overview with charts and metrics"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage users, roles, and permissions"
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Issue and track certificates"
    },
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Create and manage courses"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-primary shadow-glow">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
            Modern Admin Panel
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive, responsive admin dashboard built with React, TypeScript, and TailwindCSS. 
            Manage users, applications, certificates, and more with a beautiful, professional interface.
          </p>
          
          {/* Hero Image */}
          <div className="mb-8 max-w-4xl mx-auto">
            <img 
              src={heroImage} 
              alt="Modern Admin Dashboard Preview"
              className="w-full rounded-2xl shadow-custom-lg border border-border/50"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => navigate(isAuthenticated ? "/admin" : "/signin")}
            >
              {isAuthenticated ? "Access Admin Panel" : "Sign In"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hover:bg-accent/50 transition-colors"
            >
              View Documentation
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {isLoading ? "Loading..." : `Redirecting to ${isAuthenticated ? "admin panel" : "sign in"} in 3 seconds...`}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-lg bg-gradient-primary/10 w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Built with React, TypeScript, TailwindCSS, and Recharts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
