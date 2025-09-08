import { Users, UserCheck, Clock, FileText, BookOpen, Award, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats } from "@/lib/mockData";

const stats = [
  {
    title: "Total Users",
    value: dashboardStats.totalUsers,
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "All registered users",
  },
  {
    title: "Active Users", 
    value: dashboardStats.activeUsers,
    change: "+8%",
    changeType: "positive" as const,
    icon: UserCheck,
    description: "Currently active users",
  },
  {
    title: "Pending Applications",
    value: dashboardStats.pendingApplications,
    change: "-5%", 
    changeType: "negative" as const,
    icon: Clock,
    description: "Awaiting review",
  },
  {
    title: "Active Courses",
    value: dashboardStats.activeCourses,
    change: "+15%",
    changeType: "positive" as const, 
    icon: BookOpen,
    description: "Currently running",
  },
  {
    title: "Certificates Issued",
    value: dashboardStats.activeCertificates,
    change: "+23%",
    changeType: "positive" as const,
    icon: Award,
    description: "Valid certificates",
  },
  {
    title: "Monthly Activity",
    value: "94%",
    change: "+2%",
    changeType: "positive" as const,
    icon: Activity,
    description: "User engagement",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="rounded-lg bg-gradient-primary/10 p-2">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div className="flex items-center text-xs">
                <TrendingUp
                  className={`mr-1 h-3 w-3 ${
                    stat.changeType === "positive"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                />
                <span
                  className={`font-medium ${
                    stat.changeType === "positive"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}