import { Users, UserCheck, Clock, FileText, BookOpen, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/dashboard";
import { dashboardStats } from "@/lib/mockData";

export function DashboardStats() {
  const { data: apiStats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  // Merge API data with mock data
  const combinedStats = {
    ...dashboardStats,
    totalUsers: apiStats?.userStats?.totalUsers ?? 0,
    activeUsers: apiStats?.userStats?.activeUsers ?? 0,
    pendingUsers: apiStats?.userStats?.pendingUsers ?? 0,
    pendingApplications: apiStats?.pendingApplicationsForTeaching ?? 0,
    activeCourses: apiStats?.activeCourseCount ?? dashboardStats.activeCourses,
    activeCertificates: apiStats?.activeCertificateCount ?? dashboardStats.activeCertificates,
  };

  const stats = [
    {
      title: "Total Users",
      value: combinedStats.totalUsers,
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "All registered users",
      isFromApi: true,
    },
    {
      title: "Active Users",
      value: combinedStats.activeUsers,
      change: "+8%",
      changeType: "positive" as const,
      icon: UserCheck,
      description: "Currently active users",
      isFromApi: true,
    },
    {
      title: "Pending Users",
      value: combinedStats.pendingUsers,
      change: "-5%",
      changeType: "negative" as const,
      icon: Clock,
      description: "Awaiting activation",
      isFromApi: true,
    },
    {
      title: "Pending Applications",
      value: combinedStats.pendingApplications,
      change: "-3%",
      changeType: "negative" as const,
      icon: FileText,
      description: "Teacher applications awaiting review",
      isFromApi: true,
    },
    {
      title: "Active Courses",
      value: combinedStats.activeCourses,
      change: "+15%",
      changeType: "positive" as const,
      icon: BookOpen,
      description: "Currently running",
      isFromApi: true,
    },
    {
      title: "Certificates Issued",
      value: combinedStats.activeCertificates,
      change: "+23%",
      changeType: "positive" as const,
      icon: Award,
      description: "Valid certificates",
      isFromApi: true,
    },
  ];

  if (isLoading) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-custom-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
    );
  }

  return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
            <Card
                key={stat.title}
                className="bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-smooth"
            >
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
