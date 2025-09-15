import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardChartsData, DashboardChartsData } from "@/lib/api/dashboardCharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function DashboardCharts() {
  const [chartsData, setChartsData] = useState<DashboardChartsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        const data = await getDashboardChartsData();
        setChartsData(data);
      } catch (error) {
        console.error("Failed to load charts data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  if (loading) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card className="md:col-span-2 bg-gradient-card border-0 shadow-custom-md">
            <CardHeader>
              <Skeleton className="h-6 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        </div>
    );
  }

  if (!chartsData) {
    return <div>Failed to load charts data</div>;
  }

  return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Roles Distribution */}
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              User Roles Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                      data={chartsData.userRoles}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                  >
                    {chartsData.userRoles.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {chartsData.userRoles.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-muted-foreground">{entry.name}</span>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card className="bg-gradient-card border-0 shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData.applicationStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                  />
                  <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                  />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card className="md:col-span-2 bg-gradient-card border-0 shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Monthly Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartsData.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                  />
                  <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                  />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                  />
                  <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      name="Applications"
                  />
                  <Line
                      type="monotone"
                      dataKey="certificates"
                      stroke="hsl(var(--success))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                      name="Certificates"
                  />
                  <Line
                      type="monotone"
                      dataKey="courses"
                      stroke="hsl(var(--warning))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
                      name="Courses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}