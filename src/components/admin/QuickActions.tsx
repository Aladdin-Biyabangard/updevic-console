import { Plus, UserPlus, FileText, BookOpen, Award, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quickActions = [
  {
    title: "Add New User",
    description: "Create a new user account",
    icon: UserPlus,
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    action: "add-user",
  },
  {
    title: "Review Applications",
    description: "Check pending teacher applications",
    icon: FileText,
    color: "bg-gradient-to-r from-amber-500 to-orange-500",
    action: "review-applications",
  },
  {
    title: "Create Course",
    description: "Set up a new course",
    icon: BookOpen,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
    action: "create-course",
  },
  {
    title: "Issue Certificate",
    description: "Generate a new certificate",
    icon: Award,
    color: "bg-gradient-to-r from-purple-500 to-violet-500",
    action: "issue-certificate",
  },
  {
    title: "View Reports",
    description: "Access analytics and reports",
    icon: BarChart3,
    color: "bg-gradient-to-r from-pink-500 to-rose-500",
    action: "view-reports",
  },
  {
    title: "Bulk Actions",
    description: "Perform multiple operations",
    icon: Plus,
    color: "bg-gradient-to-r from-indigo-500 to-blue-500",
    action: "bulk-actions",
  },
];

export function QuickActions() {
  const handleAction = (action: string) => {
    console.log(`Executing action: ${action}`);
    // TODO: Implement actual actions
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-custom-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="ghost"
              className="h-auto p-4 justify-start text-left hover:bg-gradient-secondary/50 transition-all duration-300 ease-smooth group"
              onClick={() => handleAction(action.action)}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg ${action.color} shadow-custom-sm group-hover:shadow-custom-md transition-shadow duration-300`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}